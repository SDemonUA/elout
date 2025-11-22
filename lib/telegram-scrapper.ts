import { load } from 'cheerio'
import type { ScheduleInfo } from '../types'

export const revalidate = 0

const CHANNEL_ID = 'pat_cherkasyoblenergo'
const BASE_URL = `https://t.me/s/`
const CHANNEL_URL = `${BASE_URL}${CHANNEL_ID}`

export async function getSchedule() {
  try {
    const res = await fetch(CHANNEL_URL, {
      next: {
        revalidate: 5
      }
    })
    const text = await res.text()
    const $ = load(text)

    let scheduleArticle: ScheduleInfo | null = null

    const messageElements = $('.tgme_widget_message').toArray();
    for (const elem of messageElements.toReversed()) {
      // Cheerio doesn't support .text() with line breaks, so we use .html() and replace <br> with \n
      const messageText = $(elem).find('br').replaceWith('\n').end().text();
      if (messageText.includes('Години відсутності електропостачання')) {
        const meta = $(elem).find('a.tgme_widget_message_date');
        const schedule: Record<string, [startMin: number, endMin: number][]> = {};

        // Target line example: "1.1 00:00 - 00:30, 02:30 - 04:30, 08:00 - 11:00, 14:00 - 17:00, 19:00 - 22:00"
        messageText.split('\n').forEach(line => {
          const lineMatch = line.trim().match(
            /^(\d+\.\d+)\s+/
          )
          if (lineMatch) {
            const groupName = lineMatch[1];
            const timeRanges = line.trim().slice(lineMatch[1].length).split(',').map(range => range.trim());
            for (const timeRange of timeRanges) {
              const match = timeRange.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
              if (!match) continue;

              if (!schedule[groupName]) {
                schedule[groupName] = [];
              }

              const parts = match;
              const range = parts.slice(1).map(time => {
                const [hour, min] = time.split(':').map(Number);
                return hour * 60 + min;
              }) as [number, number];
              schedule[groupName].push(range)
            }
          }
        });


        const msgDate = meta.find('time').attr('datetime') || ''
        scheduleArticle = {
          url: meta.attr('href') || '',
          date: msgDate,
          schedule,
          scheduleDate: parseScheduleTargetDate(messageText, msgDate)
        }


        break;
      }
    }

    return scheduleArticle
  }
  catch (error) {
    console.error('Error fetching schedule from Telegram:', error)
    return null
  }
}

function parseScheduleTargetDate(msgText: string, msgDate: string): string {
  if (!msgDate) return new Date().toISOString();
  const date = new Date(msgDate);
  const tommorow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const isTodaySchedule = !msgText.includes(tommorow.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  }));

  return (isTodaySchedule ? date : tommorow).toISOString();
}
import { load } from 'cheerio'

const BASE_URL = 'https://www.cherkasyoblenergo.com'
const NEWS_URL = `${BASE_URL}/static/news`

export async function getSchedule() {
  try {

    const response = await fetch(NEWS_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'text/html',
        'Accept-Encoding': 'gzip',
      }
    })

    const html = await response.text()
    const $ = load(html)

    let scheduleArticle: {
      url: string
      date: string
      title: string
    } | null = null

    $('a .heading-and-text').each((i, elem) => {
      const date = $(elem).find('.author').text()
      const title = $(elem).find('.heading-and-text2').text()

      if (title.includes('Графік погодинних відключень на')) {
        scheduleArticle = {
          url: $(elem).closest('a').attr('href') || '',
          date,
          title
        }
      }
    })

    return scheduleArticle
  }
  catch (error) {
    console.error('Error fetching schedule:', error)
    return null
  }
}

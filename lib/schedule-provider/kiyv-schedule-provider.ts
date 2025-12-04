import { ScheduleProvider } from "./schedule-provider";

export class KiyvScheduleProvider implements ScheduleProvider {
  private readonly url =
    "https://app.yasno.ua/api/blackout-service/public/shutdowns/regions/25/dsos/902/planned-outages";

  async getSchedule() {
    const res = await fetch(this.url);

    if (!res.ok) return null;

    const data = (await res.json()) as {
      [x: string]: {
        today: {
          date: string;
          slots: {
            type: string;
            start: number;
            end: number;
          }[];
          status: string;
        };
        tomorrow: {
          date: string;
          slots: {
            type: string;
            start: number;
            end: number;
          }[];
          status: string;
        };
        updatedOn: string;
      };
    };

    const result = {
      url: "https://static.yasno.ua/kyiv/outages",
      date: Object.values(data)[0].updatedOn,
      scheduleDate: new Date().toISOString(),
      schedule: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.today.slots
            .filter((slot) => slot.type === "Definite")
            .map((slot) => [slot.start, slot.end] as [number, number]),
        ])
      ),
    };

    return result;
  }
}

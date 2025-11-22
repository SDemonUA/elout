export type TimeRange = [startMin: number, endMin: number];
export type ScheduleInfo = {
  url: string
  date: string
  schedule: Record<string, TimeRange[]>
  scheduleDate: string
}
export type ScheduleInfo = {
  url: string;
  date: string;
  schedule: Record<string, [startMin: number, endMin: number][]>;
  scheduleDate: string;
};

export interface ScheduleProvider {
  getSchedule(): Promise<ScheduleInfo | null>;
}

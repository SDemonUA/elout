import { ScheduleProvider } from "./schedule-provider";
import { CherkasyScheduleProvider } from "./cherkasy-schedule-provider";
import { KiyvScheduleProvider } from "./kiyv-schedule-provider";
import { DniproScheduleProvider } from "./dnipro-schedule-provider";

export class ScheduleProviderFactory {
  static getScheduleProvider(city: string): ScheduleProvider | null {
    switch (city.toLowerCase()) {
      case "cherkasy":
        return new CherkasyScheduleProvider();
      case "kyiv":
        return new KiyvScheduleProvider();
      case "dnipro":
        return new DniproScheduleProvider();
      default:
        return null;
    }
  }
}

export const supportedCities = ["cherkasy", "kyiv", "dnipro"];

export function getCityLabel(city: string): string {
  const cityLabels: Record<string, string> = {
    cherkasy: "Черкаси",
    kyiv: "Київ",
    dnipro: "Дніпро",
  };
  return cityLabels[city.toLowerCase()] || city;
}

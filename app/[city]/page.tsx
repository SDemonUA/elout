import { supportedCities, getCityLabel, ScheduleProviderFactory } from "@/lib/schedule-provider";

import EmptySchedule from "@/components/empty-schedule";
import Schedule from "@/components/schedule";
import { ChevronLeft } from "lucide-react";

import { Suspense } from "react";
import Link from "next/link";

export function generateStaticParams() {
  return supportedCities.map((city) => ({ city }));
}

export const dynamicParams = false;
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityLabel = getCityLabel(city);
  return {
    title: `Графік відключень електроенергії у ${cityLabel}`,
    description: `Перегляньте актуальний графік відключень електроенергії у місті ${cityLabel}. Будьте в курсі планових відключень та керуйте своїм часом ефективно.`,
  };
}

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const city = (await params).city.toLowerCase();

  const cityLabel = getCityLabel(city);
  const scheduleProvider = ScheduleProviderFactory.getScheduleProvider(city);
  const schedule = scheduleProvider ? await scheduleProvider.getSchedule() : null;

  if (!schedule) {
    return <EmptySchedule />;
  }

  // TODO: This code called on server side so it doesn't know utc offset of the user
  const scheduleUpdateDate = new Date(schedule.date).toLocaleString("uk-UA", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const scheduleTargetDate = new Date(schedule.scheduleDate).toLocaleDateString("uk-UA", {
    dateStyle: "long",
  });

  const sourceUrl = new URL(schedule.url);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <div>
        <Link href="/" className="flex items-center text-cyan-600 hover:text-cyan-800 ">
          <ChevronLeft className="inline-block mr-2" />
          <span>Обрати інше місто</span>
        </Link>
      </div>
      <div className="m-4 text-center">
        <div className="text-7xl">{cityLabel}</div>
      </div>
      <h2 className="text-2xl text-center font-semibold mb-1">
        Графік відключень на {scheduleTargetDate}
      </h2>
      <p className="mb-4 text-sm text-center text-secondary-foreground">
        Оновлено: {scheduleUpdateDate}
        <br />
        Джерело:{" "}
        <a
          href={sourceUrl.toString()}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-cyan-800"
        >
          {sourceUrl.hostname + sourceUrl.pathname}
        </a>
      </p>

      <Suspense>
        <Schedule schedule={schedule} />
      </Suspense>
    </main>
  );
}

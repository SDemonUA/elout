import { getSchedule } from "../lib/telegram-scrapper";
import Schedule from "../components/schedule";
import { Suspense } from "react";

export default async function Home() {
  const schedule = await getSchedule();

  if (!schedule) {
    return (
      <main className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl text-center font-semibold mb-1">Графік відключень відсутній</h2>
        <p className="mb-4 text-sm text-center text-secondary-foreground">
          На жаль, наразі немає доступного графіка відключень електроенергії. Будь ласка, перевірте
          пізніше.
        </p>
      </main>
    );
  }

  // TODO: This code called on server side so it doesn't know utc offset of the user
  const scheduleUpdateDate = new Date(schedule.date).toLocaleString("uk-UA", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const scheduleTargetDate = new Date(schedule.scheduleDate).toLocaleDateString("uk-UA", {
    dateStyle: "long",
  });

  return (
    <main className="max-w-3xl mx-auto p-4">
      <div className="m-4 text-center">
        <div
          className="text-9xl"
          style={{
            fontFeatureSettings: '"ss05"',
            fontVariantLigatures: "common-ligatures",
          }}
        >
          F
        </div>
        <div className="text-7xl">Черкаси</div>
      </div>
      <h2 className="text-2xl text-center font-semibold mb-1">
        Графік відключень на {scheduleTargetDate}
      </h2>
      <p className="mb-4 text-sm text-center text-secondary-foreground">
        Оновлено: {scheduleUpdateDate}
      </p>

      <Suspense>
        <Schedule schedule={schedule} />
      </Suspense>
    </main>
  );
}

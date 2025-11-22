import { getSchedule } from "../lib/telegram-scrapper";
import Schedule from "../components/schedule";

export default async function Home() {
  const schedule = await getSchedule();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Schedule schedule={schedule} />
      </main>
    </div>
  );
}

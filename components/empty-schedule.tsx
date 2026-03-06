import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function EmptySchedule({ cityLabel }: { cityLabel?: string }) {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <div>
        <Link href="/" className="flex items-center text-cyan-600 hover:text-cyan-800">
          <ChevronLeft className="inline-block mr-2" />
          <span>Обрати інше місто</span>
        </Link>
      </div>
      {cityLabel && (
        <div className="m-4 text-center">
          <div className="text-7xl">{cityLabel}</div>
        </div>
      )}
      <div className="mt-8 text-center">
        <div className="text-5xl mb-4">💡</div>
        <h2 className="text-2xl font-semibold mb-2">Новий графік ще не доступний</h2>
        <p className="text-secondary-foreground">
          Сподіваємось, це хороший знак — відключень електроенергії не планується!
        </p>
      </div>
    </main>
  );
}

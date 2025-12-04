import { supportedCities, getCityLabel } from "../lib/schedule-provider";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4 mt-4 text-center">Виберіть ваше місто</h1>
      <nav className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
        {supportedCities.map((city) => {
          const cityLabel = getCityLabel(city);
          return (
            <Link
              key={city}
              href={`/${city}`}
              className={
                "text-cyan-600 hover:text-cyan-800 text-lg border rounded text-center grid gap-0.5 grid-rows-[auto auto] pt-6 pb-2"
              }
            >
              <span
                key="img"
                className="text-7xl"
                style={{
                  fontFeatureSettings: '"ss05"',
                  fontVariantLigatures: "common-ligatures",
                }}
              >
                {city === "cherkasy" ? "F" : ""}
                {city === "kyiv" ? "D" : ""}
                {city === "dnipro" ? "N" : ""}
              </span>
              <span key="label">{cityLabel}</span>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}

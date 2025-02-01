import Weather from "@/components/Weather";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-white flex items-center justify-center gap-2">
          <span className="text-4xl">🌊</span>
          Flow Weather
        </h1>
        <Suspense>
          <Weather />
        </Suspense>
      </main>
    </div>
  );
}

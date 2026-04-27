"use client";

import Navbar from "./components/Navbar";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen font-sans dark:from-black dark:to-gray-900">
   
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start mx-auto">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div onClick={() => router.push('/gameplay')} className="flex max-w-xs flex-col gap-4 rounded-xl border p-4 text-left cursor-pointer hover:shadow-md transition">
              <h3 className="text-2xl font-semibold">Statle</h3>
              <p className="text-sm text-gray-500">
                A Pokémon stats guessing game inspired by Wordle and Statle.
              </p>
            </div>
            <div onClick={() => router.push('/Leaderboard')} className="flex max-w-xs flex-col gap-4 rounded-xl border p-4 text-left cursor-pointer hover:shadow-md transition">
              <h3 className="text-2xl font-semibold">Leaderboard</h3>
              <p className="text-sm text-gray-500">
                See how you rank against other players!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
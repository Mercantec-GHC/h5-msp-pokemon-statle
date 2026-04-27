
'use client';
import Link from "next/dist/client/link";
import Navbar from "../components/Navbar";
import {useEffect, useState} from 'react';

export default function GameplayPage() {

     const API = "http://localhost:5175/api/game";

  const [pokemon, setPokemon] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [usedStats, setUsedStats] = useState<string[]>([]);
  const [gained, setGained] = useState(0);
  const [revealedStats, setRevealedStats] = useState<Record<string, number>>({});
  const [gameOver, setGameOver] = useState(false);


  useEffect(() => {
    startGame();
  }, []);

  async function startGame() {
    const response = await fetch(`${API}/start`, {
      method: "POST",
    });
    const data = await response.json();
    setPokemon(data.pokemonName);
    setScore(0);
    setUsedStats([]);
    setMessage(data.message);
    
  }


  async function handleGuess(stat: string) {
    const res = await fetch(`${API}/guess/${stat}`, {
      method: "POST"
    });

    const data = await res.json();

    setPokemon(data.pokemonName);
    setScore(data.score);
    setMessage(data.message);
    setUsedStats(data.usedStats);
    setGained(data.gained);
    setRevealedStats(prev => ({
      ...prev,
      [stat]: data.gained
    }));

    // If all 6 stats are used, end game
    if (data.usedStats.length >= 6) {
      setGameOver(true);
      await SaveGame();
    }
  }

async function SaveGame() {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
  await fetch(`${API}/save`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
}


  return (
    <>
     
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {pokemon}
              </h2>
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-green-100 dark:bg-green-900/50 rounded-full blur-2xl"></div>
                <img 
                  src={`https://img.pokemondb.net/artwork/${pokemon}.jpg`}
                  alt={pokemon} 
                  className="relative w-full h-full object-contain drop-shadow-xl"
                />
                
              </div>
              <div className="mt-4">
                  <p className="text-xl font-bold text-white">Score: {score}</p>
                  <p className="text-sm text-gray-400">{message}</p>
              </div>
              <div className="mt-4">
                  <p className="text-lg font-bold text-white">Gained: +{gained}</p>
              </div>
              <div className="mt-4">
                   Remaining: {0 + score}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {!gameOver ? (
                <>
                  <button onClick={() => handleGuess("hp")} disabled={usedStats.includes("hp")} className="flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">HP</span>
                    <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">{revealedStats["hp"] ?? "?"}</span>
                  </button>
                  <button onClick={() => handleGuess("attack")} disabled={usedStats.includes("attack")} className="flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Attack</span>
                    <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">{revealedStats["attack"] ?? "?"}</span>
                  </button>
                  <button onClick={() => handleGuess("defense")} disabled={usedStats.includes("defense")} className="flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Defense</span>
                    <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">{revealedStats["defense"] ?? "?"}</span>
                  </button>
                  <button onClick={() => handleGuess("sp_atk")} disabled={usedStats.includes("sp_atk")} className="flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Sp. Atk</span>
                    <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">{revealedStats["sp_atk"] ?? "?"}</span>
                  </button>
                  <button onClick={() => handleGuess("sp_def")} disabled={usedStats.includes("sp_def")} className="flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Sp. Def</span>
                    <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">{revealedStats["sp_def"] ?? "?"}</span>
                  </button>
                  <button onClick={() => handleGuess("speed")} disabled={usedStats.includes("speed")} className="flex justify-between items-center w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Speed</span>
                    <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">{revealedStats["speed"] ?? "?"}</span>
                  </button>
                </>
              ) : (
                <div className="text-center mt-8">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">All stats used! Game saved.</p>
                  <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
                    &larr; Back to Home
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="text-center mt-8">
              <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
                  &larr; Back to Home
              </Link>
          </div>
        </div>
      </main>
    </>
  );
}

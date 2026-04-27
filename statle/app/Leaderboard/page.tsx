"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function LeaderboardPage() {
    const LEADERBOARD_ENDPOINT = "http://localhost:5175/api/Leaderboard/top?limit=10";
    const [leaderboard, setLeaderboard] = useState<{ username: string; score: number }[]>([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(LEADERBOARD_ENDPOINT);
                const data = await response.json();
                setLeaderboard(data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            }
        };

        fetchLeaderboard();
    }, []);


  return (
    
    <div className="flex flex-col font-sans dark:from-black dark:to-gray-900">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32  bg-white dark:bg-black sm:items-start mx-auto">
        <h1 className="text-3xl font-semibold">Leaderboard</h1>
        <div className="w-full mt-8">
          <table className="w-full table-auto border-collapse border rounded-2xl border-gray-300">
            
            <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Rank</th>
                    <th className="border border-gray-300 px-4 py-2">Username</th>
                    <th className="border border-gray-300 px-4 py-2">Score</th>
                </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.score}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
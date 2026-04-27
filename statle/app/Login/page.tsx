"use client"

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
export default function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const Login = async (username: string, password: string) => {
        try {
            const response = await fetch("http://localhost:5175/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await Login(username, password);

if (data && data.token) {
    localStorage.setItem("jwtToken", data.token);

    localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username })
    );

    window.location.href = "/";
    
            } else {
                setError("Login failed. No token received.");
            }
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
            <div className="w-full max-w-md mx-auto">
                <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">Login to Statle</h2>
                <form className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-6" onSubmit={handleSubmit}>
                    <div className="mb-4 ">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 " htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-rose-800 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
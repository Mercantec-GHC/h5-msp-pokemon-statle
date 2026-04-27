"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.username);
      } catch {
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  };

  useEffect(() => {
    loadUser();

    // 🔥 listen for changes (important)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    setUsername(null);
    router.push("/");
  };

  return (
    <header className="w-full bg-rose-950 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <span
          className="text-2xl font-extrabold tracking-tight text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
          Statle
        </span>

        <div className="flex gap-2 sm:gap-4 items-center">
          {username ? (
            <>
              <span className="text-white font-semibold">
                Hello, {username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-white text-rose-950 font-semibold hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/Register")}
                className="px-4 py-2 rounded-md bg-white/90 text-rose-950 font-semibold hover:bg-white"
              >
                Register
              </button>
              <button
                onClick={() => router.push("/Login")}
                className="px-4 py-2 rounded-md bg-white/90 text-rose-950 font-semibold hover:bg-white"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
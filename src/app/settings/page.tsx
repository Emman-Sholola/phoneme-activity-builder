"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = document.cookie
      .split("; ")
      .find((row) => row.startsWith("theme="))
      ?.split("=")[1];

    const initialTheme = savedTheme || "dark";

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  function changeTheme(newTheme: string) {
    setTheme(newTheme);

    document.documentElement.setAttribute("data-theme", newTheme);

    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <section>
      <div className="page-heading">
        <h2>Settings</h2>
        <p>Choose how the activity builder appears.</p>
      </div>

      <div className="settings-card">
        <h3>Theme</h3>
        <p>Select your preferred colour theme.</p>

        <div className="theme-options">
          <button
            type="button"
            className={theme === "light" ? "selected" : ""}
            onClick={() => changeTheme("light")}
            aria-pressed={theme === "light"}
          >
            Light
          </button>

          <button
            type="button"
            className={theme === "dark" ? "selected" : ""}
            onClick={() => changeTheme("dark")}
            aria-pressed={theme === "dark"}
          >
            Dark
          </button>
        </div>
      </div>
    </section>
  );
}
"use client";

import {
  useTheme,
  type ThemePreference,
} from "@/context/ThemeContext";

type ThemeOption = {
  value: ThemePreference;
  label: string;
  description: string;
};

const themeOptions:
  ThemeOption[] = [
    {
      value: "system",
      label: "System",
      description:
        "Automatically follows your device or browser colour preference.",
    },
    {
      value: "light",
      label: "Light",
      description:
        "Always use the light colour theme.",
    },
    {
      value: "dark",
      label: "Dark",
      description:
        "Always use the dark colour theme.",
    },
  ];

export default function SettingsPage() {
  const {
    preference,
    resolvedTheme,
    setPreference,
  } =
    useTheme();

  const currentThemeLabel =
    preference === "system"
      ? `System (${resolvedTheme === "dark" ? "Dark" : "Light"})`
      : preference === "dark"
        ? "Dark"
        : "Light";

  return (
    <section>
      <div className="page-heading">
        <h2>
          Settings
        </h2>

        <p>
          Choose how the activity builder appears and
          manage your display preferences.
        </p>
      </div>

      <div className="settings-card">
        <h3>
          Appearance
        </h3>

        <p>
          Select your preferred colour theme.
          Your choice is saved automatically.
        </p>

        <div
          className="theme-options"
          role="group"
          aria-label="Colour theme"
        >
          {themeOptions.map(
            (option) => {
              const selected =
                preference ===
                option.value;

              return (
                <button
                  type="button"
                  key={
                    option.value
                  }
                  className={
                    selected
                      ? "selected"
                      : ""
                  }
                  aria-pressed={
                    selected
                  }
                  onClick={() => {
                    setPreference(
                      option.value,
                    );
                  }}
                >
                  {
                    option.label
                  }
                </button>
              );
            },
          )}
        </div>

        <p
          className="theme-status"
          aria-live="polite"
        >
          Current theme:{" "}
          <strong>
            {
              currentThemeLabel
            }
          </strong>
        </p>

        <div className="theme-descriptions">
          {themeOptions.map(
            (option) => (
              <p
                key={
                  option.value
                }
              >
                <strong>
                  {
                    option.label
                  }:
                </strong>{" "}
                {
                  option.description
                }
              </p>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
"use client";

export default function SettingsPage() {
  function changeTheme(theme: "light" | "dark") {
    document.documentElement.setAttribute(
      "data-theme",
      theme,
    );

    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <section>
      <div className="page-heading">
        <h2>Settings</h2>

        <p>
          Choose how the activity builder appears.
        </p>
      </div>

      <div className="settings-card">
        <h3>Theme</h3>

        <p>
          Select your preferred colour theme.
        </p>

        <div className="theme-options">
          <button
            type="button"
            className="lightThemeButton"
            onClick={() => {
              changeTheme("light");
            }}
          >
            Light
          </button>

          <button
            type="button"
            className="darkThemeButton"
            onClick={() => {
              changeTheme("dark");
            }}
          >
            Dark
          </button>
        </div>
      </div>
    </section>
  );
}
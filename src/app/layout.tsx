import type {
  Metadata,
} from "next";
import {
  cookies,
} from "next/headers";
import "./globals.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import {
  ThemeProvider,
  type ThemePreference,
} from "@/context/ThemeContext";

export const metadata: Metadata = {
  title:
    "Phoneme Activity Builder",
  description:
    "A phoneme based classroom activity builder",
};

function isThemePreference(
  value: string | undefined,
): value is ThemePreference {
  return (
    value === "system" ||
    value === "light" ||
    value === "dark"
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore =
    await cookies();

  const storedTheme =
    cookieStore.get(
      "theme",
    )?.value;

  const initialPreference:
    ThemePreference =
    isThemePreference(
      storedTheme,
    )
      ? storedTheme
      : "system";

  const initialTheme =
    initialPreference ===
    "dark"
      ? "dark"
      : "light";

  return (
    <html
      lang="en"
      data-theme={
        initialTheme
      }
      data-theme-preference={
        initialPreference
      }
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var preference =
                    document.documentElement.dataset.themePreference || "system";

                  var systemDark =
                    window.matchMedia(
                      "(prefers-color-scheme: dark)"
                    ).matches;

                  var resolvedTheme =
                    preference === "system"
                      ? systemDark
                        ? "dark"
                        : "light"
                      : preference;

                  document.documentElement.dataset.theme =
                    resolvedTheme;

                  document.documentElement.style.colorScheme =
                    resolvedTheme;
                } catch (error) {
                  document.documentElement.dataset.theme =
                    "light";

                  document.documentElement.style.colorScheme =
                    "light";
                }
              })();
            `,
          }}
        />
      </head>

      <body>
        <ThemeProvider
          initialPreference={
            initialPreference
          }
        >
          <Header />

          <Navbar />

          <main>
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
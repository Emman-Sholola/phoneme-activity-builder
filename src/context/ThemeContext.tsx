"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemePreference =
  | "system"
  | "light"
  | "dark";

type ResolvedTheme =
  | "light"
  | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (
    preference: ThemePreference,
  ) => void;
};

type ThemeProviderProps = {
  children: ReactNode;
  initialPreference: ThemePreference;
};

const ThemeContext =
  createContext<
    ThemeContextValue | undefined
  >(undefined);

const systemThemeQuery =
  "(prefers-color-scheme: dark)";

function subscribeToSystemTheme(
  callback: () => void,
) {
  const mediaQuery =
    window.matchMedia(
      systemThemeQuery,
    );

  mediaQuery.addEventListener(
    "change",
    callback,
  );

  return () => {
    mediaQuery.removeEventListener(
      "change",
      callback,
    );
  };
}

function getSystemThemeSnapshot() {
  return window.matchMedia(
    systemThemeQuery,
  ).matches;
}

function getServerSystemThemeSnapshot() {
  return false;
}

function resolveTheme(
  preference: ThemePreference,
  systemDark: boolean,
): ResolvedTheme {
  if (
    preference === "system"
  ) {
    return systemDark
      ? "dark"
      : "light";
  }

  return preference;
}

function applyTheme(
  preference: ThemePreference,
  systemDark: boolean,
) {
  const resolvedTheme =
    resolveTheme(
      preference,
      systemDark,
    );

  document.documentElement.dataset.theme =
    resolvedTheme;

  document.documentElement.dataset.themePreference =
    preference;

  document.documentElement.style.colorScheme =
    resolvedTheme;
}

export function ThemeProvider({
  children,
  initialPreference,
}: ThemeProviderProps) {
  const [
    preference,
    setPreferenceState,
  ] =
    useState<ThemePreference>(
      initialPreference,
    );

  const systemDark =
    useSyncExternalStore(
      subscribeToSystemTheme,
      getSystemThemeSnapshot,
      getServerSystemThemeSnapshot,
    );

  const resolvedTheme =
    resolveTheme(
      preference,
      systemDark,
    );

  useEffect(() => {
    applyTheme(
      preference,
      systemDark,
    );
  }, [
    preference,
    systemDark,
  ]);

  const setPreference =
    useCallback(
      (
        nextPreference:
          ThemePreference,
      ) => {
        setPreferenceState(
          nextPreference,
        );

        document.cookie =
          `theme=${nextPreference}; path=/; max-age=31536000; SameSite=Lax`;

        applyTheme(
          nextPreference,
          systemDark,
        );
      },
      [
        systemDark,
      ],
    );

  const value =
    useMemo<ThemeContextValue>(
      () => ({
        preference,
        resolvedTheme,
        setPreference,
      }),
      [
        preference,
        resolvedTheme,
        setPreference,
      ],
    );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(
      ThemeContext,
    );

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider.",
    );
  }

  return context;
}
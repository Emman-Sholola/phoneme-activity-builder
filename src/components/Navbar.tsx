"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav
      className="navbar"
      aria-label="Primary navigation"
    >
      <button
        type="button"
        className="menu-toggle"
        onClick={() => {
          setMenuOpen((current) => !current);
        }}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation-links"
      >
        ☰
      </button>

      <div
        id="primary-navigation-links"
        className={`nav-links ${menuOpen ? "open" : ""}`}
      >
        <Link
          href="/"
          onClick={closeMenu}
        >
          Home
        </Link>

        <Link
          href="/wordle"
          onClick={closeMenu}
        >
          Wordle
        </Link>

        <Link
          href="/word-search"
          onClick={closeMenu}
        >
          Word Search
        </Link>

        <Link
          href="/manage"
          onClick={closeMenu}
        >
          Manage
        </Link>

        <Link
          href="/about"
          onClick={closeMenu}
        >
          About
        </Link>

        <Link
          href="/settings"
          onClick={closeMenu}
        >
          Settings
        </Link>
      </div>
    </nav>
  );
}
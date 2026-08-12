"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/wordle" onClick={() => setMenuOpen(false)}>
          Wordle
        </Link>
        <Link href="/word-search" onClick={() => setMenuOpen(false)}>
          Word Search
        </Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>
          About
        </Link>
        <Link href="/settings" onClick={() => setMenuOpen(false)}>
          Settings
        </Link>
      </div>
    </nav>
  );
}
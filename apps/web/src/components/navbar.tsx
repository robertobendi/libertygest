"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Camere", href: "/camere" },
  { label: "Servizi", href: "/#servizi" },
  { label: "Posizione", href: "/#posizione" },
  { label: "Contatti", href: "/#footer" },
];

const languages = ["IT", "EN", "DE", "FR"];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("IT");

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1e3a5f]/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#c9a96e] flex items-center justify-center shadow-md">
              <span className="text-[#1e3a5f] font-bold text-sm tracking-tight">
                HB
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-semibold text-base tracking-wide leading-tight">
                Hotel Belvedere
              </p>
              <p className="text-[#c9a96e] text-xs tracking-widest uppercase">
                Lugano
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-[#c9a96e] text-sm font-medium tracking-wide transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: language + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`text-xs font-medium px-2 py-1 rounded transition-colors duration-150 ${
                    activeLang === lang
                      ? "text-[#c9a96e] bg-white/10"
                      : "text-white/60 hover:text-white/90"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <Link href="/prenota">
              <Button
                className="bg-[#c9a96e] hover:bg-[#b8954d] text-[#1e3a5f] font-semibold px-5 h-9 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Prenota
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1e3a5f] border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-white/80 hover:text-[#c9a96e] text-base font-medium py-2 border-b border-white/10 last:border-0 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                      activeLang === lang
                        ? "text-[#c9a96e] bg-white/10"
                        : "text-white/60"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <Link href="/prenota" onClick={() => setMenuOpen(false)}>
                <Button className="bg-[#c9a96e] hover:bg-[#b8954d] text-[#1e3a5f] font-semibold px-5 h-9 rounded-full">
                  Prenota
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

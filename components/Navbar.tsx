"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Trophy, Users, Home, BarChart2, Menu, X } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Campeonatos", href: "/campeonatos", icon: Trophy },
  { name: "Atletas", href: "/atletas", icon: Users },
  { name: "Ranking", href: "/ranking", icon: BarChart2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background-surface/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tightest uppercase text-foreground leading-none">
              Ascend
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-brand">
              Climbing Series
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-brand-50 text-brand-700 shadow-sm"
                    : "text-foreground-muted hover:bg-background-subtle hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active ? "text-brand" : "text-foreground-subtle"
                  }`}
                />
                <span>{item.name}</span>
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-brand" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Action */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <Link
            href="/atletas"
            className="rounded-lg border border-border bg-background-surface px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-background-subtle hover:border-border-strong transition-all"
          >
            Buscar Atleta
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground-muted hover:bg-background-subtle hover:text-foreground focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background-surface px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-foreground-muted hover:bg-background-subtle hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-brand" : "text-foreground-subtle"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap, LayoutDashboard } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="LogClaw" className="h-8 w-8" />
            <span className="font-bold text-lg tracking-tight">LogClaw</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm text-text-secondary hover:text-black transition-colors">Features</Link>
            <Link href="/#pricing" className="text-sm text-text-secondary hover:text-black transition-colors">Pricing</Link>
            <Link href="/security" className="text-sm text-text-secondary hover:text-black transition-colors">Security</Link>

            {/* Auth-aware section */}
            {isLoaded && (
              isSignedIn ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-black transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <Link href="/sign-in" className="text-sm text-text-secondary hover:text-black transition-colors">
                  Sign in
                </Link>
              )
            )}

            <a
              href={process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              Request Demo
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <Link href="/#features" onClick={() => setOpen(false)} className="block text-sm py-2 text-text-secondary">Features</Link>
          <Link href="/#pricing" onClick={() => setOpen(false)} className="block text-sm py-2 text-text-secondary">Pricing</Link>
          <Link href="/security" onClick={() => setOpen(false)} className="block text-sm py-2 text-text-secondary">Security</Link>

          {isLoaded && (
            isSignedIn ? (
              <div className="flex items-center justify-between py-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 text-sm text-text-secondary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <Link href="/sign-in" onClick={() => setOpen(false)} className="block text-sm py-2 text-text-secondary">Sign in</Link>
            )
          )}

          <a
            href={process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg"
          >
            Request Demo
          </a>
        </div>
      )}
    </nav>
  );
}

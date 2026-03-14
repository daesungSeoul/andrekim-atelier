"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-charcoal text-white">
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-8 text-[11px] tracking-wider text-warm-gray-light">
          <span>FANTASY &amp; ELEGANCE SINCE 1962</span>
          <div className="hidden sm:flex items-center gap-4">
            {session ? (
              <>
                <span>{session.user.name}님 환영합니다</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hover:text-gold transition-colors"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-gold transition-colors">
                  LOGIN
                </Link>
                <Link href="/auth/register" className="hover:text-gold transition-colors">
                  JOIN
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl tracking-[0.25em] text-gold font-light">
              ANDRÉ KIM
            </span>
            <span className="text-[10px] tracking-[0.5em] text-warm-gray-light mt-0.5">
              A T E L I E R
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-widest">
            <Link
              href="/costumes"
              className="text-white/80 hover:text-gold transition-colors py-2"
            >
              COLLECTION
            </Link>
            {session && (
              <Link
                href="/mypage"
                className="text-white/80 hover:text-gold transition-colors py-2"
              >
                MY ATELIER
              </Link>
            )}
            {session?.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-white/80 hover:text-gold transition-colors py-2"
              >
                ADMIN
              </Link>
            )}
            <Link
              href="/costumes"
              className="border border-gold text-gold px-5 py-2 text-xs tracking-widest hover:bg-gold hover:text-charcoal transition-all"
            >
              RESERVATION
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white/80"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 pb-6 space-y-1">
            <Link
              href="/costumes"
              className="block py-3 text-sm tracking-widest text-white/80 hover:text-gold"
              onClick={() => setMenuOpen(false)}
            >
              COLLECTION
            </Link>
            {session ? (
              <>
                <Link
                  href="/mypage"
                  className="block py-3 text-sm tracking-widest text-white/80 hover:text-gold"
                  onClick={() => setMenuOpen(false)}
                >
                  MY ATELIER
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block py-3 text-sm tracking-widest text-white/80 hover:text-gold"
                    onClick={() => setMenuOpen(false)}
                  >
                    ADMIN
                  </Link>
                )}
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                  className="block py-3 text-sm tracking-widest text-white/80 hover:text-gold"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block py-3 text-sm tracking-widest text-white/80 hover:text-gold"
                  onClick={() => setMenuOpen(false)}
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/register"
                  className="block py-3 text-sm tracking-widest text-white/80 hover:text-gold"
                  onClick={() => setMenuOpen(false)}
                >
                  JOIN
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

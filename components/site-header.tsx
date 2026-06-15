"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { navItems, siteName } from "@/lib/site";
import { logout } from "@/app/actions/auth";
import type { SessionUser } from "@/lib/auth";

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (q) {
      router.push(`/?s=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="site-title">
            {siteName}
          </Link>

          <div className="site-header__nav-group">
            <nav
              id="site-primary-nav"
              className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
              aria-label="Primary"
            >
              <ul className="site-nav__list">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={isActive ? "is-active" : undefined}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}

                {user && (
                  <>
                    <li>
                      <Link href="/writing/new" className="site-nav__action">
                        + Writing
                      </Link>
                    </li>
                    <li>
                      <span className="site-nav__action site-nav__action--disabled" title="Coming soon">
                        + Studio Work
                      </span>
                    </li>
                    <li className="site-nav__user">
                      <button
                        type="button"
                        className="site-nav__user-trigger"
                        onClick={() => setUserMenuOpen((o) => !o)}
                        aria-expanded={userMenuOpen}
                      >
                        {user.name} ▾
                      </button>
                      {userMenuOpen && (
                        <div className="site-nav__user-dropdown">
                          <Link
                            href="/writing/manage"
                            className="site-nav__user-item"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            My writing
                          </Link>
                          {user.role === "ADMIN" && (
                            <Link
                              href="/admin/users"
                              className="site-nav__user-item"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Manage users
                            </Link>
                          )}
                          <form action={logout}>
                            <button type="submit" className="site-nav__user-item site-nav__user-item--danger">
                              Sign out
                            </button>
                          </form>
                        </div>
                      )}
                    </li>
                  </>
                )}
              </ul>
            </nav>

            <button
              type="button"
              className="site-search-btn"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <button
              type="button"
              className="site-nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="site-primary-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden="true">{menuOpen ? "×" : "⋯"}</span>
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div
          className="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="search-overlay__box">
            <form className="search-overlay__form" onSubmit={handleSearch}>
              <input
                ref={inputRef}
                className="search-overlay__input"
                type="search"
                placeholder="Search writings…"
                autoComplete="off"
              />
              <button type="submit" className="search-overlay__submit" aria-label="Submit search">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </form>
            <button
              type="button"
              className="search-overlay__close"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

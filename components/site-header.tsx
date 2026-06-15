"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems, siteName } from "@/lib/site";
import { logout } from "@/app/actions/auth";
import type { SessionUser } from "@/lib/auth";

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
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
                      + Work
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
  );
}

import { siteName } from "@/lib/site";

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <ul className="site-footer__social">
          <li>
            <a
              href="https://www.instagram.com/_dompu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </li>
          <li>
            <a
              href="mailto:phuongdo281106@gmail.com"
              aria-label="Email"
            >
              <MailIcon />
            </a>
          </li>
        </ul>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} {siteName}
        </p>
      </div>
    </footer>
  );
}

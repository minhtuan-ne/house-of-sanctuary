import type { Metadata } from "next";
import { Open_Sans, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteName } from "@/lib/site";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s – ${siteName}`,
  },
  description: "Writing, translation, and notes.",
  icons: {
    icon: '/icon.jpg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${openSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="site-shell">
        <SiteHeader user={user} />
        <main className="site-main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

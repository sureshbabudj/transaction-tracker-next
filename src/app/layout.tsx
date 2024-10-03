import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LOGO_DATA_IMG, SITE_TITLE_TEXT } from "./dashboard/components/Logo";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: SITE_TITLE_TEXT,
  description: "useful to identify and group transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={LOGO_DATA_IMG()} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

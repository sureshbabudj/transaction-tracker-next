import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar1 from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Transaction Tracker",
  description: "useful to identify and group transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

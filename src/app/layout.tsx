import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

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
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Transaction Tracker</h1>
          <Navigation />
          <br />
          {children}
        </div>
      </body>
    </html>
  );
}

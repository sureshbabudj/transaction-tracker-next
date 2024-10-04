import type { Metadata } from "next";

import "./globals.css";
import { LOGO_DATA_IMG, SITE_TITLE_TEXT } from "./dashboard/components/Logo";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider, AppWrapper } from "./App.context";

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
      <AppProvider>
        <AppWrapper>
          {children}
          <Toaster />
        </AppWrapper>
      </AppProvider>
    </html>
  );
}

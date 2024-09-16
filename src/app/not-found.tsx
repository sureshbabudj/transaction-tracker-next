/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo, SITE_TITLE } from "./dashboard/components/Logo";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Link
        className="text-center flex items-center mb-10 text-2xl"
        href="/"
        passHref
      >
        <Logo className="mr-2" />
        {SITE_TITLE}
      </Link>
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-500 mb-8 text-center max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been
        moved or deleted.
      </p>
      <Link href="/" passHref>
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
}

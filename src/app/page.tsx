import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo, SITE_TITLE, SITE_TITLE_TEXT } from "./dashboard/components/Logo";
import { validateAuth } from "@/lib/auth";
import Logout from "./auth/[slug]/components/logout";

export default async function Home() {
  const { session } = await validateAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex">
            <Logo className="mr-2" /> {SITE_TITLE}
          </h1>
          <nav>
            <ul className="flex space-x-4">
              {session?.userId ? (
                <>
                  <li>
                    <Link href="dashboard" passHref>
                      <Button variant="ghost">Dashboard</Button>
                    </Link>
                  </li>
                  <li>
                    <Logout />
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="auth/signin" passHref>
                      <Button variant="ghost">Login</Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/signup" passHref>
                      <Button>Sign Up</Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simplify Your Financial Life
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Effortlessly categorize and manage your banking transactions with
            {SITE_TITLE}.
          </p>
          <Link href="/auth/signup" passHref>
            <Button size="lg">Get Started for Free</Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Smart Categorization</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our AI-powered system learns from your transactions to
                automatically categorize new entries.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Insightful Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Gain valuable insights into your spending habits with our
                detailed financial reports and visualizations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bank Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Securely connect your bank accounts for real-time transaction
                updates and seamless data import.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h3>
          <ol className="list-decimal list-inside space-y-4 text-gray-600 dark:text-gray-300">
            <li>Sign up for a free account</li>
            <li>Connect your bank accounts or upload your transaction data</li>
            <li>Let our smart system categorize your transactions</li>
            <li>Review and adjust categories as needed</li>
            <li>Gain insights from your personalized financial dashboard</li>
          </ol>
        </section>

        <section className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Take Control of Your Finances?
          </h3>
          <Link href="/auth/signup" passHref>
            <Button size="lg">Create Your Free Account</Button>
          </Link>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
              © {new Date().getFullYear()} {SITE_TITLE_TEXT}. All rights
              reserved.
            </p>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

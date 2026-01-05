import { AuthButton } from "@/components/auth-button";
import { Navbar } from "@/components/navbar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 w-full flex flex-col items-center justify-center py-20 px-5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Welcome to Newsletter App
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Stay connected with the latest updates, news, and insights delivered
            straight to your inbox.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-5 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Stay Updated</h3>
                <p className="text-muted-foreground">
                  Receive curated content tailored to your interests and
                  preferences.
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Easy Management</h3>
                <p className="text-muted-foreground">
                  Manage your subscriptions and preferences with ease from one
                  central dashboard.
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your data is protected with industry-leading security and
                  privacy standards.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center border-t border-t-foreground/10 py-8 px-5">
        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 Newsletter App. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

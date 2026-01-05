import React from "react";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { NavLinks } from "@/components/tutorial/nav-links";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Your Personalized Newsletter
            </h1>
          </div>

          <div className="mt-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Current Preferences
              </h2>
              <p className="mb-4">No preferences set yet</p>
              <Button asChild>
                <Link href="/preferences">Set Up Newsletter</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;

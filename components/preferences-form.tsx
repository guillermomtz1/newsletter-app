"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function PreferencesForm() {
  const [tickerSymbols, setTickerSymbols] = useState<string[]>([
    "AAPL",
    "GOOGL",
    "TSLA",
    "MSFT",
    "NVDA",
  ]);
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents refreshing the page
    const ticker = inputValue.trim().toUpperCase();

    if (!ticker) {
      return;
    }

    if (tickerSymbols.includes(ticker)) {
      alert("Ticker symbol already added");
      return;
    }

    // Add to local state first
    const updatedTickers = [...tickerSymbols, ticker];
    setTickerSymbols(updatedTickers);
    setInputValue("");

    // Save to API
    try {
      const response = await fetch("/api/user-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker_symbols: updatedTickers,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to save ticker:", error);
        // Revert local state on error
        setTickerSymbols(tickerSymbols);
        alert("Failed to save ticker symbol. Please try again.");
      }
    } catch (error) {
      console.error("Error saving ticker:", error);
      // Revert local state on error
      setTickerSymbols(tickerSymbols);
      alert("Failed to save ticker symbol. Please try again.");
    }
  };

  const handleRemoveTicker = async (ticker: string) => {
    // Remove from local state first
    const updatedTickers = tickerSymbols.filter((t) => t !== ticker);
    setTickerSymbols(updatedTickers);

    // Save to API
    try {
      const response = await fetch("/api/user-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker_symbols: updatedTickers,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to remove ticker:", error);
        // Revert local state on error
        setTickerSymbols(tickerSymbols);
        alert("Failed to remove ticker symbol. Please try again.");
      }
    } catch (error) {
      console.error("Error removing ticker:", error);
      // Revert local state on error
      setTickerSymbols(tickerSymbols);
      alert("Failed to remove ticker symbol. Please try again.");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Customize Your Daily Stock Newsletter
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter the ticker symbols of the companies you&apos;re interested in
            to receive personalized stock market news daily.
          </p>
        </div>

        {/* Add Button*/}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Add Ticker Symbols</h2>
          <form onSubmit={handleAddTicker} className="flex gap-2 mb-6">
            <Input
              type="text"
              placeholder="Enter company ticker symbol..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={inputValue.length === 0}
              className={` ${
                inputValue.length === 0
                  ? "cursor-not-allowed"
                  : "hover:bg-primary/90"
              }`}
            >
              Add
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {tickerSymbols.map((ticker) => (
              <div
                key={ticker}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-foreground"
              >
                <span>{ticker}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTicker(ticker)}
                  className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${ticker}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

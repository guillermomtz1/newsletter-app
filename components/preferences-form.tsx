"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function PreferencesForm() {
  const [tickerSymbols, setTickerSymbols] = useState<string[]>([
    "AAPL",
    "GOOGL",
    "TSLA",
    "MSFT",
    "NVDA",
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const ticker = inputValue.trim().toUpperCase();
    if (ticker && !tickerSymbols.includes(ticker)) {
      setTickerSymbols([...tickerSymbols, ticker]);
      setInputValue("");
    }
  };

  const handleRemoveTicker = (ticker: string) => {
    setTickerSymbols(tickerSymbols.filter((t) => t !== ticker));
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
            <Button type="submit">Add</Button>
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

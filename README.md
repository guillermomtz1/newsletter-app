# 📰 Stock Market Newsletter App

A personalized stock market newsletter application that delivers AI-generated summaries of news articles for your favorite ticker symbols directly to your inbox.

## Overview

This application allows users to:

- **Sign up and authenticate** using Supabase Auth
- **Customize their preferences** by selecting stock ticker symbols they want to track
- **Receive personalized newsletters** via email with AI-generated summaries of relevant news articles
- **Automatically schedule** newsletters to be sent at their preferred frequency

## How It Works

1. **User Registration & Preferences**: Users sign up and select ticker symbols (e.g., AAPL, MSFT, NVDA) they want to monitor
2. **News Aggregation**: The app fetches recent news articles from NewsAPI for each selected ticker symbol
3. **AI Summarization**: Using Inngest and OpenAI's GPT model, the articles are summarized into an engaging, personalized newsletter format
4. **Email Delivery**: The newsletter is formatted as HTML and sent to users via EmailJS
5. **Automated Scheduling**: Inngest handles the scheduling and automation of newsletter delivery

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Supabase Auth with cookie-based sessions
- **Database**: Supabase (PostgreSQL) for storing user preferences
- **Background Jobs**: Inngest for scheduling and workflow orchestration
- **AI**: OpenAI GPT-5-nano for newsletter summarization
- **News API**: NewsAPI.org for fetching stock-related articles
- **Email**: EmailJS for sending newsletters

## Features

- 🔐 **Secure Authentication** - Password-based auth with Supabase
- 📊 **Customizable Preferences** - Add/remove ticker symbols to track
- 🤖 **AI-Powered Summaries** - Intelligent newsletter generation with context-aware summaries
- 📧 **Email Delivery** - Beautiful HTML newsletters delivered to your inbox
- ⏰ **Automated Scheduling** - Set it and forget it - newsletters are sent automatically
- 🎨 **Modern UI** - Clean, responsive interface built with shadcn/ui

## Getting Started

### Prerequisites

Before running this application, you'll need accounts and API keys for:

- **Supabase** - For authentication and database
- **NewsAPI** - For fetching stock news articles
- **EmailJS** - For sending newsletters
- **Inngest** - For background job scheduling
- **OpenAI** - For AI-powered newsletter summarization (via Inngest)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd newsletter-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

   # NewsAPI
   NEWS_API_KEY=your_newsapi_key

   # EmailJS
   EMAILJS_SERVICE_ID=your_emailjs_service_id
   EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   EMAILJS_PRIVATE_KEY=your_emailjs_private_key

   # Inngest
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   ```

4. Set up the database:

   Run the migrations in the `supabase/migrations/` directory to create the `user_preferences` table.

5. Start the Inngest dev server (required for background jobs):

   ```bash
   npx inngest-cli dev
   ```

6. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Database Schema

The app uses a `user_preferences` table to store user ticker symbol preferences:

- `user_id` (UUID, primary key) - References Supabase auth users
- `email` (TEXT) - User's email address
- `ticker_symbols` (TEXT[]) - Array of ticker symbols the user wants to track
- `updated_at` (TIMESTAMP) - Last update timestamp

## Project Structure

```
newsletter-app/
├── app/                    # Next.js app router pages and API routes
│   ├── api/
│   │   ├── inngest/       # Inngest webhook endpoint
│   │   └── user-preferences/ # User preferences API
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── preferences/       # Preferences management page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── preferences-form.tsx
├── inngest/              # Inngest functions
│   └── functions/
│       └── newsletterSchedule.ts # Newsletter generation workflow
├── lib/                  # Utility functions
│   ├── email.ts          # EmailJS integration
│   ├── news.ts           # NewsAPI integration
│   └── supabase/         # Supabase client configuration
└── supabase/
    └── migrations/       # Database migrations
```

## How Newsletter Generation Works

1. User saves preferences with ticker symbols
2. An Inngest event is triggered with the user's email and ticker symbols
3. The `newsletterSchedule` function:
   - Fetches news articles from NewsAPI for each ticker symbol
   - Uses AI (OpenAI GPT-5-nano) to generate a personalized newsletter summary
   - Formats the content as HTML
   - Sends the newsletter via EmailJS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

import { inngest } from "@/inngest/client";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - Fetch user's ticker symbols
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const userEmail = user.email || "";

    const { data, error } = await supabase
      .from("user_preferences")
      .select("ticker_symbols")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" - which is okay for new users
      console.error("Error fetching ticker symbols:", error);
      return NextResponse.json(
        { error: "Failed to fetch ticker symbols" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      tickerSymbols: data?.ticker_symbols || [],
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update user preferences
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { frequency, ticker_symbols } = body;

    if (!Array.isArray(ticker_symbols)) {
      return NextResponse.json(
        { error: "ticker_symbols must be an array" },
        { status: 400 }
      );
    }

    // Validate ticker symbols (uppercase, alphanumeric, reasonable length)
    const validTickers = ticker_symbols
      .map((t: string) => t.trim().toUpperCase())
      .filter((t: string) => /^[A-Z]{1,5}$/.test(t));

    const userId = user.id;
    const userEmail = user.email || "";

    const { error: upsertError } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: userId,
          email: userEmail,
          ticker_symbols: validTickers,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      console.error("Error upserting user preferences:", upsertError);
      return NextResponse.json(
        { error: "Failed to save preferences" },
        { status: 500 }
      );
    }

    // Schedule the first newsletter based on frequency
    const now = new Date();

    // Schedule for tomorrow at 9 AM
    const scheduleTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    scheduleTime.setHours(9, 0, 0, 0);

    // Trigger Inngest function to schedule newsletter
    try {
      console.log("📤 Attempting to send Inngest event: newsletter-schedule");
      console.log("📦 Event data:", { userId, tickerSymbols: validTickers });

      const eventResult = await inngest.send({
        name: "newsletter-schedule",
        data: {
          userId: userId,
          email: userEmail,
          tickerSymbols: validTickers,
          frequency: frequency,
          scheduledFor: scheduleTime.toISOString(),
          isTest: true,
        },
      });

      console.log("✅ Inngest event sent successfully!");
      console.log("🆔 Event IDs:", eventResult.ids);
      console.log("📋 Full response:", JSON.stringify(eventResult, null, 2));
    } catch (inngestError: unknown) {
      // Log but don't fail the request if Inngest fails
      console.error("❌ Failed to send Inngest event:", inngestError);
      console.error(
        "💬 Error message:",
        inngestError instanceof Error
          ? inngestError.message
          : String(inngestError)
      );
      console.error("📋 Error details:", JSON.stringify(inngestError, null, 2));

      // Common issue: Dev server not running
      const errorMessage =
        inngestError instanceof Error
          ? inngestError.message
          : String(inngestError);
      if (errorMessage.includes("401") || errorMessage.includes("Event key")) {
        console.warn(
          "⚠️  Make sure Inngest dev server is running: npx inngest-cli dev"
        );
      }
    }

    return NextResponse.json({
      success: true,
      tickerSymbols: validTickers,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user's ticker symbols
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const userEmail = user.email || "";
    const { frequency, tickerSymbols } = await request.json();

    if (!Array.isArray(tickerSymbols)) {
      return NextResponse.json(
        { error: "tickerSymbols must be an array" },
        { status: 400 }
      );
    }

    // Validate ticker symbols (uppercase, alphanumeric, reasonable length)
    const validTickers = tickerSymbols
      .map((t: string) => t.trim().toUpperCase())
      .filter((t: string) => /^[A-Z]{1,5}$/.test(t));

    // Upsert: insert or update
    const { error } = await supabase.from("user_preferences").upsert(
      {
        user_id: userId,
        email: userEmail,
        ticker_symbols: validTickers,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) {
      console.error("Error updating ticker symbols:", error);
      return NextResponse.json(
        { error: "Failed to update ticker symbols" },
        { status: 500 }
      );
    }
    // Schedule the first newsletter based on frequency
    const now = new Date();

    // Schedule for tomorrow at 9 AM
    const scheduleTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    scheduleTime.setHours(9, 0, 0, 0);

    // Trigger Inngest function to schedule newsletter
    try {
      console.log("📤 Attempting to send Inngest event: newsletter-schedule");
      console.log("📦 Event data:", { userId, tickerSymbols: validTickers });

      const eventResult = await inngest.send({
        name: "newsletter-schedule",
        data: {
          userId: userId,
          email: userEmail,
          tickerSymbols: validTickers,
          frequency: frequency,
          scheduledFor: scheduleTime.toISOString(),
          isTest: true,
        },
      });

      console.log("✅ Inngest event sent successfully!");
      console.log("🆔 Event IDs:", eventResult.ids);
      console.log("📋 Full response:", JSON.stringify(eventResult, null, 2));
    } catch (inngestError: unknown) {
      // Log but don't fail the request if Inngest fails
      console.error("❌ Failed to send Inngest event:", inngestError);
      console.error(
        "💬 Error message:",
        inngestError instanceof Error
          ? inngestError.message
          : String(inngestError)
      );
      console.error("📋 Error details:", JSON.stringify(inngestError, null, 2));

      // Common issue: Dev server not running
      const errorMessage =
        inngestError instanceof Error
          ? inngestError.message
          : String(inngestError);
      if (errorMessage.includes("401") || errorMessage.includes("Event key")) {
        console.warn(
          "⚠️  Make sure Inngest dev server is running: npx inngest-cli dev"
        );
      }
    }

    return NextResponse.json({
      success: true,
      tickerSymbols: validTickers,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

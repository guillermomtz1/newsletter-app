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
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ticker_symbols } = body;

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

    const { data, error: upsertError } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: userId,
          email: userEmail,
          ticker_symbols: validTickers,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (upsertError) {
      console.error("Error upserting user preferences:", upsertError);
      return NextResponse.json(
        { error: "Failed to save preferences" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tickerSymbols: data.ticker_symbols,
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
    const { tickerSymbols } = await request.json();

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
    const { data, error } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: userId,
          email: userEmail,
          ticker_symbols: validTickers,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error updating ticker symbols:", error);
      return NextResponse.json(
        { error: "Failed to update ticker symbols" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tickerSymbols: data.ticker_symbols,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

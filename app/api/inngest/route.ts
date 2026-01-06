import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { functions } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
  // Use signing key for production, only pass if it exists
  ...(process.env.INNGEST_SIGNING_KEY && {
    signingKey: process.env.INNGEST_SIGNING_KEY,
  }),
});

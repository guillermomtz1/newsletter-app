import { inngest } from "../client";
import { fetchArticles } from "@/lib/news";

type Article = {
  title: string;
  url: string;
  description: string;
};

export const newsletterSchedule = inngest.createFunction(
  { id: "newsletterScheduled", name: "Newsletter Schedule" },
  { event: "newsletter-schedule" },
  async ({ event, step, runId }) => {
    try {
      // Fetch articles per ticker symbol
      const symbols = event.data?.tickerSymbols || [
        "MSFT",
        "NVDA",
        "META",
        "FTNT",
      ];
      console.log("📊 Using ticker symbols:", symbols);

      const allArticles = await step.run("fetch-news", async () => {
        console.log("📰 Fetching articles for symbols:", symbols);
        const articles = await fetchArticles(symbols);
        console.log(`✅ Fetched ${articles.length} articles total`);
        console.log("📄 Articles:", JSON.stringify(articles, null, 2));
        return articles;
      });

      // Generate the AI summary
      console.log("🤖 Generating AI summary...");
      const summary = await step.ai.infer("summarize-news", {
        body: {
          messages: [
            {
              role: "system",
              content: `You are an expert newsletter editor creating a personalized newsletter. Write a concise, engaging summary that:
              - highlights the most important stories
              - Uses friendly, conversational tone
              - Keeps reader informed and engaged
              - Provides context and insights

              Format the response as a proper newsletter with a title and orginized content.
              Clearly separate summaries from each stock and make it email-friendly with clear sections for each ticker symbol and engagin subject lines.
              Focus on news that might move the stock price.`,
            },
            {
              role: "user",
              content: `Create a newsletter summary for these articles from yesterday.
              Ticker symbols requested: ${symbols.join(",")}
              
              Articles:
              ${allArticles
                .map(
                  (article: Article, idx: number) => `${idx + 1}. ${
                    article.title
                  }\n
                  ${article.description}\n
      
                  Source: ${article.url}\n`
                )
                .join("\n")}`,
            },
          ],
        },
        model: step.ai.models.openai({ model: "gpt-5-nano" }),
      });

      console.log("📝 AI Summary Result:");
      console.log("=".repeat(80));
      console.log(summary);
      console.log("=".repeat(80));

      return {};
    } catch (error) {
      console.error("❌ Function error:", error);
      throw error;
    }
  }
);

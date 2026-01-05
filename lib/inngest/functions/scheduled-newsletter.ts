import { inngest } from "../client";
import { fetchArticles } from "@/lib/news";

type Article = {
  title: string;
  url: string;
  description: string;
};

export default inngest.createFunction(
  { id: "newsletter/scheduled" },
  { event: "newsletter.scheduled" },
  async ({ event, step, runId }) => {
    // Fetch articles per ticker symbol
    const symbols = ["MSFT", "NVDA", "META", "FTNT"];

    const allArticles = await step.run("fetch-news", async () => {
      return fetchArticles(symbols);
    });

    // Generate the AI summary
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
            Make it email-friendly with clear sections for each ticker symbol and engagin subject lines.
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
      model: step.ai.models.openai({ model: "gpt-4o" }),
    });

    console.log(summary.choices[0].message.content);
  }
);

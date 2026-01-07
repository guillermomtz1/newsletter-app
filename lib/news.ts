interface NewsApiArticle {
  title?: string | null;
  url?: string | null;
  description?: string | null;
}

interface NewsApiResponse {
  articles: NewsApiArticle[];
}

export async function fetchArticles(
  symbols: string[]
): Promise<Array<{ title: string; url: string; description: string }>> {
  const since = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();

  const promises = symbols.map(async (symbol) => {
    try {
      // Format date as YYYY-MM-DD for NewsAPI
      const dateStr = since.split("T")[0];

      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        symbol
      )}&from=${dateStr}&sortBy=publishedAt`;

      const response = await fetch(url, {
        headers: {
          "X-API-Key": process.env.NEWS_API_KEY || "",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `Failed to fetch for ticker symbol "${symbol}":`,
          response.status,
          response.statusText,
          errorData
        );
        return [];
      }

      const data = (await response.json()) as NewsApiResponse;
      return data.articles.slice(0, 5).map((article: NewsApiArticle) => ({
        title: article.title || "No title",
        url: article.url || "#",
        description: article.description || "No description available",
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  const results = await Promise.all(promises);
  return results.flat();
}

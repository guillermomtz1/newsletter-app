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
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          symbol
        )}&from=${since}&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
      );

      if (!response.ok) {
        console.error("Failed to fetch for this ticker symbol", symbol);
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

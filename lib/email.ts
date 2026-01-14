import emailjs from "@emailjs/nodejs";

type Article = {
  title: string;
  url: string;
  description: string;
};

export async function sendEmail(
  email: string,
  ticker_symbols: string[],
  article_count: number,
  current_date: string,
  newsletter_content: string,
  description: string,
  articles?: Article[]
) {
  const articlesHtml =
    articles && articles.length > 0
      ? articles
          .map(
            (article) => `
        <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 3px solid #3b82f6; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
          <div style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 10px; line-height: 1.4;">
            <a href="${article.url}" target="_blank" style="color: #1f2937; text-decoration: none;">${article.title}</a>
          </div>
          <div style="color: #4b5563; margin-bottom: 12px; line-height: 1.6;">
            ${article.description}
          </div>
          <a href="${article.url}" target="_blank" style="display: inline-block; color: #3b82f6; text-decoration: none; font-size: 14px; font-weight: 500;">
            Read full article →
          </a>
        </div>
      `
          )
          .join("")
      : "";

  const templateParams = {
    to_email: email,
    ticker_symbols: ticker_symbols.join(", "), // Array for Handlebars #each loop
    ticker_count: ticker_symbols.length,
    article_count,
    current_date,
    newsletter_content,
    articles_html: articlesHtml,
  };

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  await emailjs.send(serviceId!, templateId!, templateParams, {
    publicKey,
    privateKey,
  });
}

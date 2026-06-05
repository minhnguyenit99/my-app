import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import { JSDOM, VirtualConsole } from "jsdom";
import { redis } from "./redis";

export const STORIES_KEY = "hn:best:stories";

export interface Story {
  id: string;
  url: string;
  title: string | null;
  byline: string | null;
  content: string | null;
  excerpt: string | null;
  imageUrl: string | null;
}

export async function getDetails(targetUrl: string) {
  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",

        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",

        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) {
      return null;
    }
    const html = await res.text();

    // 1. Create a custom Virtual Console
    const virtualConsole = new VirtualConsole();

    // 2. Intercept JSDOM errors
    virtualConsole.on("jsdomError", (error) => {
      if (error.message.includes("Could not parse CSS stylesheet")) {
        console.warn(`[Ignored] CSS Parsing Error on URL: ${targetUrl}`);
      } else {
        console.error(`JSDOM Error on ${targetUrl}:`, error);
      }
    });

    // 3. Pass the virtualConsole into your JSDOM instance
    const dom = new JSDOM(html, {
      url: targetUrl,
      virtualConsole: virtualConsole,
    });

    const document = dom.window.document;
    const imageUrl =
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content") ||
      document
        .querySelector('meta[name="twitter:image"]')
        ?.getAttribute("content") ||
      document.querySelector('link[rel="image_src"]')?.getAttribute("href") ||
      null;
    const reader = new Readability(document);
    const parsed = reader.parse();
    if (!parsed || !parsed.title) {
      return null;
    }
    return {
      title: parsed.title,
      byline: parsed.byline,
      content: parsed.content,
      excerpt: parsed.excerpt,
      imageUrl,
    };
  } catch (e) {
    return null;
  }
}

export async function runWorker() {
  console.log("Starting scrape cycle...");

  try {
    // 1. Lấy danh sách Best từ HN
    const res = await fetch("https://news.ycombinator.com/best");
    const html = await res.text();
    const $ = cheerio.load(html);

    const currentList: Story[] = [];

    $(".athing").each((_, element) => {
      const id = $(element).attr("id");
      const url = $(element).find(".titleline a").attr("href");

      if (id && url) {
        currentList.push({
          id,
          url,
          title: null,
          byline: null,
          content: null,
          excerpt: null,
          imageUrl: null,
        });
      }
    });

    console.log(`Found ${currentList.length} stories on front page`);

    // 2. Lấy toàn bộ data cũ từ Redis (1 key duy nhất)
    const existingDataRaw = await redis.get(STORIES_KEY);
    const existingStories = existingDataRaw ? JSON.parse(existingDataRaw) : [];

    // 3. Tạo Map để tra cứu O(1) xem bài nào đã scrape rồi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cacheMap = new Map(existingStories.map((s: any) => [s.id, s]));

    const finalStories = [];

    // 4. Lặp qua danh sách hiện tại: Dùng lại cache hoặc scrape mới
    for (const story of currentList) {
      if (cacheMap.has(story.id)) {
        // Đã có data, lấy trực tiếp từ cache nạp vào list mới
        finalStories.push(cacheMap.get(story.id));
      } else {
        // Bài mới, tiến hành scrape
        console.log(`Scraping new story: ${story.id}`);
        const details = await getDetails(story.url);

        if (!details) {
          console.log(`Failed: ${story.id}`);
          continue;
        }

        finalStories.push({
          id: story.id,
          url: story.url,
          ...details,
        });

        console.log(`Scraped and added: ${story.id}`);
      }
    }

    // 5. Ghi đè toàn bộ mảng hoàn chỉnh vào 1 key duy nhất
    await redis.set(STORIES_KEY, JSON.stringify(finalStories));

    console.log(
      `Cycle completed. Saved ${finalStories.length} stories to ${STORIES_KEY}.`
    );
    return finalStories;
  } catch (error) {
    console.error("Worker failed", error);
  }
}

// Chạy 12 giờ một lần để giao diện Frontend luôn cập nhật nhanh nhất
setInterval(runWorker, 12 * 60 * 60 * 1000);
runWorker(); // Initial run


# Hacker News Top Stories Reader

A modern, fast web application that scrapes the "Best" stories from Hacker News, extracts the core reading content from the linked articles, and serves them through a sleek Next.js interface. 

The project uses a background worker to continuously scrape, parse, and cache article data in Redis, ensuring the frontend is incredibly fast and avoids overloading external servers.

## ✨ Features

* **Automated Scraping:** A dedicated worker runs in the background to scrape front-page links from Hacker News.
* **Smart Content Extraction:** Utilizes `jsdom` and `@mozilla/readability` to strip away ads and clutter, saving only the clean article text, title, and OpenGraph metadata (images).
* **High-Performance Caching:** Data is stored in Redis (`ioredis`), allowing for $O(1)$ lookups and lightning-fast page renders without re-scraping existing articles.
* **Modern UI:** Built with Next.js 16 (App Router) and Tailwind CSS 4 for a responsive, mobile-first design.
* **Concurrent Dev Environment:** Run both the Next.js frontend and the scraping worker side-by-side using a single command.

## 🛠️ Tech Stack

* **Frontend:** Next.js 16, React 19, Tailwind CSS 4
* **Backend / Worker:** Node.js, TypeScript, Cheerio
* **Content Parsing:** JSDOM, Mozilla Readability
* **Database / Cache:** Redis (ioredis)
* **Testing:** Vitest, Playwright

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a local or cloud instance of **Redis** running.

### 1. Clone & Install
```bash
git clone [https://github.com/yourusername/your-repo-name.git](https://github.com/yourusername/your-repo-name.git)
cd your-repo-name
npm install

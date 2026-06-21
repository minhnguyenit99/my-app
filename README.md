# 📰 Hacker News Top Stories Reader

A modern, high-performance web application that scrapes the **Best** stories from Hacker News, extracts clean article content, and serves it through a fast, responsive Next.js interface.

Instead of scraping articles on every request, a background worker continuously fetches, parses, and caches articles in Redis, allowing the frontend to deliver near-instant page loads while minimizing requests to external websites.

---

## ✨ Features

* 🚀 **Automated Scraping**

  * A dedicated background worker continuously scrapes the latest **Best** stories from Hacker News.

* 📖 **Clean Article Extraction**

  * Uses **JSDOM** and **Mozilla Readability** to remove ads, navigation, and other clutter, keeping only the article title, content, and Open Graph metadata.

* ⚡ **Redis Caching**

  * Parsed articles are cached in Redis using **ioredis**, providing constant-time lookups and avoiding repeated scraping.

* 🎨 **Modern UI**

  * Built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS 4** for a clean, responsive experience.

* 🔄 **Background Processing**

  * Scraping runs independently of the web application, ensuring users never wait for article parsing.

* 🧪 **Testing Ready**

  * Includes **Vitest** for unit tests and **Playwright** for end-to-end testing.

---

## 🛠 Tech Stack

| Category        | Technologies                         |
| --------------- | ------------------------------------ |
| Frontend        | Next.js 16, React 19, Tailwind CSS 4 |
| Backend         | Node.js, TypeScript                  |
| Scraping        | Cheerio                              |
| Content Parsing | JSDOM, Mozilla Readability           |
| Cache           | Redis (ioredis)                      |
| Testing         | Vitest, Playwright                   |

---

## 🚀 Getting Started

### Prerequisites

Before running the project, ensure you have:

* Node.js 20+
* npm
* A local or cloud Redis instance

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo-name.git

cd your-repo-name
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
REDIS_URL=redis://localhost:6379
```

Example for Redis Cloud:

```env
REDIS_URL=redis://default:password@host:6379
```

---

### 4. Start the Development Environment

Run both the Next.js application and the background worker simultaneously.

```bash
npm run dev:all
```

This starts:

* Next.js development server
* Background scraping worker

Open your browser:

```
http://localhost:3000
```

The worker will immediately begin scraping Hacker News and caching articles in Redis.

---

## 📂 Project Structure

```
app/
│
├── page.tsx              # Home page
├── article/[id]/         # Article pages
└── ...

lib/
├── scraper.ts            # Background scraping worker
├── redis.ts              # Redis client
├── queries.ts            # Cached data access
└── ...

public/
```

---

## ⚙️ How It Works

1. The worker fetches the latest "Best" stories from Hacker News.
2. Each article URL is downloaded.
3. JSDOM loads the page.
4. Mozilla Readability extracts the main article content.
5. Parsed content is stored in Redis.
6. The Next.js frontend retrieves cached articles and renders them instantly.

---

## 🧪 Testing

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

---

## 📜 Available Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the Next.js development server     |
| `npm run dev:all`  | Run the frontend and worker concurrently |
| `npm run build`    | Build the application                    |
| `npm run start`    | Start the production server              |
| `npm run test`     | Run Vitest unit tests                    |
| `npm run test:e2e` | Run Playwright end-to-end tests          |

---

## 📄 Environment Variables

| Variable    | Description                               |
| ----------- | ----------------------------------------- |
| `REDIS_URL` | Connection string for your Redis instance |

---

## 📄 License

This project is available under the MIT License.

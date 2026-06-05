// lib/queries.ts
import { redis } from '@/lib/redis';
import { Story } from './scraper';

const STORIES_KEY = "hn:best:stories";

export async function getTopStories(): Promise<Story[]> {
  try {
    const rawData = await redis.get(STORIES_KEY);
    
    // If Redis is empty, return an empty array safely
    if (!rawData) return [];
    
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Failed to fetch or parse stories from Redis:", error);
    // Return an empty array as a fallback so the UI doesn't break
    return []; 
  }
}
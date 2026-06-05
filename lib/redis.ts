import { config } from 'dotenv';
// Gọi hàm này để nó nạp file .env (hoặc .env.local) vào process.env
config({ path: '.env' });
// lib/redis.ts
import { Redis } from 'ioredis';

// Replace with your actual Redis connection string
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Ensure we don't create multiple connections in development
const globalForRedis = global as unknown as { redis: Redis };
export const redis = globalForRedis.redis || new Redis(redisUrl);

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTopStories } from '@/lib/queries';
import { redis } from '@/lib/redis';

// Mock Redis
vi.mock('@/lib/redis', () => ({
  redis: {
    get: vi.fn(),
  },
}));

describe('getTopStories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an array of stories when Redis has data', async () => {
    const mockStories = [{ id: '1', title: 'Test Story' }];
    vi.mocked(redis.get).mockResolvedValue(JSON.stringify(mockStories));
    const result = await getTopStories();
    expect(redis.get).toHaveBeenCalledWith('hn:best:stories');
    expect(result).toEqual(mockStories);
  });

  it('should return an empty array if Redis returns null', async () => {
    vi.mocked(redis.get).mockResolvedValue(null);
    const result = await getTopStories();
    expect(result).toEqual([]);
  });

  it('should return an empty array and catch the error if Redis throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(redis.get).mockRejectedValue(new Error('Redis connection failed'));
    const result = await getTopStories();
    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
    consoleSpy.mockRestore();
  });
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDetails } from '@/lib/scraper';

// Mock global fetch
global.fetch = vi.fn();

describe('Scraper Library - getDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return null if the fetch fails (non-200 OK)', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    const result = await getDetails('https://example.com');
    expect(result).toBeNull();
  });

  it('should parse HTML and return story details', async () => {
    const mockHtml = `
      <html>
        <head>
          <title>Test Page Title</title> <meta property="og:image" content="https://example.com/og-image.jpg" />
        </head>
        <body>
          <h1>Test Page Title</h1>
          <p>By Jane Doe</p>
          <p>This is the main content of the article to be parsed by Readability.</p>
        </body>
      </html>
    `;

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(mockHtml),
    } as unknown as Response);

    const result = await getDetails('https://example.com');
    
    expect(result).not.toBeNull();
    expect(result?.title).toBe('Test Page Title'); 
    expect(result?.imageUrl).toBe('https://example.com/og-image.jpg');
    expect(result?.content).toContain('This is the main content'); 
  });

  it('should return null if it cannot parse a title (invalid HTML)', async () => {
    const emptyHtml = `<html><body><div>Just some div</div></body></html>`;
    
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(emptyHtml),
    } as unknown as Response);

    const result = await getDetails('https://example.com');
    expect(result).toBeNull();
  });
});
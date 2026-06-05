import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoryCard } from '@/app/components/StoryCard';
import { Story } from '@/lib/scraper';

describe('StoryCard Component', () => {
  const mockStory: Story = {
    id: '123',
    url: 'https://example.com',
    title: 'Hello World',
    byline: 'John Doe',
    content: null,
    excerpt: 'This is a test excerpt.',
    imageUrl: 'https://example.com/image.jpg',
  };

  it('renders the story title, byline, and excerpt', async () => {
    const ui = await StoryCard({ story: mockStory });
    render(ui);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('✍️ John Doe')).toBeInTheDocument();
    expect(screen.getByText('This is a test excerpt.')).toBeInTheDocument();
  });

  it('renders fallback image when imageUrl is null', async () => {
    const storyWithoutImage = { ...mockStory, imageUrl: null };
    const ui = await StoryCard({ story: storyWithoutImage });
    render(ui);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/noimage.png');
  });

  it('handles missing story gracefully', async () => {
    // @ts-expect-error - testing invalid input
    const ui = await StoryCard({ story: null });
    render(ui);

    expect(screen.getByText('No story data available.')).toBeInTheDocument();
  });
});
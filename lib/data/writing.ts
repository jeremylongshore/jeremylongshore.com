/**
 * Port of plugins/StartAIToolsRSSPlugin.rb.
 *
 * Fetches the latest posts from startaitools.com's RSS feed. The Ruby
 * plugin used REXML for a real XML parse; this port intentionally avoids
 * adding an XML dependency and instead does a small tolerant regex
 * extraction of <item><title/link/pubDate/description> — CDATA- and
 * entity-safe, but not a full XML parser. If startaitools.com ever ships
 * unusual/nested markup inside those tags, this may need to graduate to a
 * real parser.
 *
 * No file cache of our own — Next's fetch cache (`next: { revalidate }`)
 * replaces the Ruby plugin's `.rss_cache.json` + stale-cache fallback.
 */
import { DataFetchError } from './errors';

const RSS_URL = 'https://startaitools.com/index.xml';
const REVALIDATE_SECONDS = 3600; // 1 hour
const USER_AGENT = 'jeremylongshore-portfolio';
const DEFAULT_MAX_POSTS = 6;
const EXCERPT_MAX_CHARS = 180;

export interface WritingPost {
  title: string;
  url: string;
  date: string;
  excerpt: string;
}

function extractItems(xml: string): string[] {
  const items: string[] = [];
  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null = itemRegex.exec(xml);
  while (match !== null) {
    items.push(match[1]);
    match = itemRegex.exec(xml);
  }
  return items;
}

function stripCdata(value: string): string {
  const trimmed = value.trim();
  const cdataMatch = /^<!\[CDATA\[([\s\S]*?)\]\]>$/.exec(trimmed);
  return cdataMatch ? cdataMatch[1] : trimmed;
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function extractTag(itemXml: string, tag: string): string | undefined {
  const regex = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = regex.exec(itemXml);
  if (!match) return undefined;
  const decoded = decodeXmlEntities(stripCdata(match[1]));
  return decoded.trim();
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, '').trim();
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}...`;
}

function formatPubDate(pubDate: string | undefined): string {
  if (!pubDate) return '';
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return pubDate;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

/** Fetches the latest `maxPosts` posts from the startaitools.com RSS feed. */
export async function getLatestPosts(maxPosts: number = DEFAULT_MAX_POSTS): Promise<WritingPost[]> {
  let response: Response;
  try {
    response = await fetch(RSS_URL, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (cause) {
    console.error('[data:writing] network error fetching startaitools.com RSS feed');
    throw new DataFetchError('Failed to fetch startaitools.com RSS feed', 'writing', { cause });
  }

  if (!response.ok) {
    console.error(`[data:writing] RSS fetch returned ${response.status}`);
    throw new DataFetchError(`RSS fetch error ${response.status}`, 'writing');
  }

  const xml = await response.text();
  const posts: WritingPost[] = [];

  for (const itemXml of extractItems(xml)) {
    if (posts.length >= maxPosts) break;

    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    if (!title || !link) continue;
    if (!link.includes('/posts/')) continue; // blog posts only, skip pages

    const pubDate = extractTag(itemXml, 'pubDate');
    const description = extractTag(itemXml, 'description');

    posts.push({
      title,
      url: link,
      date: formatPubDate(pubDate),
      excerpt: truncate(stripHtml(description ?? ''), EXCERPT_MAX_CHARS),
    });
  }

  return posts;
}

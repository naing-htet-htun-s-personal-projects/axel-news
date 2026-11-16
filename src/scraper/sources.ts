export type SourceConfig = {
  name: string;
  url: string;
  rssUrl?: string;
  selector: {
    articleLink: string;
    title: string;
    body: string;
    publishedAt?: string;
  };
  language: "my" | "en" | "mixed";
};

const DEFAULT_SELECTOR = {
  articleLink: "article a, .post-title a, h2 a",
  title: "h1, .entry-title, .post-title",
  body: ".entry-content, .post-content, article",
  publishedAt: "time, .post-date, .entry-meta time",
};

export const sources: SourceConfig[] = [
  {
    name: "Myanmar Tech Press (English)",
    url: "https://en.myanmartechpress.com",
    rssUrl: "https://en.myanmartechpress.com/feed/",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "Myanmar Tech Press (Myanmar)",
    url: "https://mm.myanmartechpress.com",
    rssUrl: "https://mm.myanmartechpress.com/feed/",
    selector: DEFAULT_SELECTOR,
    language: "my",
  },
  {
    name: "Build Myanmar Media (Tech)",
    url: "https://www.buildmyanmarmedia.com/tag/tech/",
    rssUrl: "https://www.buildmyanmarmedia.com/tag/tech/feed/",
    selector: DEFAULT_SELECTOR,
    language: "my",
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com",
    rssUrl: "https://techcrunch.com/feed/",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com",
    rssUrl: "https://www.theverge.com/rss/index.xml",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "Ars Technica",
    url: "https://arstechnica.com",
    rssUrl: "https://feeds.arstechnica.com/arstechnica/index",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com",
    rssUrl: "https://hnrss.org/frontpage",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com",
    rssUrl: "https://www.technologyreview.com/feed/",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "Wired Tech",
    url: "https://www.wired.com",
    rssUrl: "https://www.wired.com/feed/category/gear/latest/rss",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "Dev.to",
    url: "https://dev.to",
    rssUrl: "https://dev.to/feed",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "GitHub Blog",
    url: "https://github.blog",
    rssUrl: "https://github.blog/feed/",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "OpenAI News",
    url: "https://openai.com/news",
    rssUrl: "https://openai.com/news/rss.xml",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/",
    rssUrl: "https://blog.google/technology/ai/rss/",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "BleepingComputer",
    url: "https://www.bleepingcomputer.com",
    rssUrl: "https://www.bleepingcomputer.com/feed/",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
  {
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com",
    rssUrl: "https://www.smashingmagazine.com/feed/",
    selector: DEFAULT_SELECTOR,
    language: "en",
  },
];

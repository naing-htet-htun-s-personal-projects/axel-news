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

export const sources: SourceConfig[] = [
  {
    name: "Myanmar Tech Press (English)",
    url: "https://en.myanmartechpress.com",
    rssUrl: "https://en.myanmartechpress.com/feed/",
    selector: {
      articleLink: "article a, .post-title a, h2 a",
      title: "h1, .entry-title, .post-title",
      body: ".entry-content, .post-content, article",
      publishedAt: "time, .post-date, .entry-meta time",
    },
    language: "en",
  },
  {
    name: "Myanmar Tech Press (Myanmar)",
    url: "https://mm.myanmartechpress.com",
    rssUrl: "https://mm.myanmartechpress.com/feed/",
    selector: {
      articleLink: "article a, .post-title a, h2 a",
      title: "h1, .entry-title, .post-title",
      body: ".entry-content, .post-content, article",
      publishedAt: "time, .post-date, .entry-meta time",
    },
    language: "my",
  },
  {
    name: "Build Myanmar Media (Tech)",
    url: "https://www.buildmyanmarmedia.com/tag/tech/",
    rssUrl: "https://www.buildmyanmarmedia.com/tag/tech/feed/",
    selector: {
      articleLink: "article a, .post-title a, h2 a",
      title: "h1, .entry-title, .post-title",
      body: ".entry-content, .post-content, article",
      publishedAt: "time, .post-date, .entry-meta time",
    },
    language: "my",
  },
];

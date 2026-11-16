export type Language = "en" | "my";

export const LANG_COOKIE_NAME = "axel-lang";

const en = {
  // Brand & Header
  "brand.name": "Axel News",
  "brand.tagline": "Myanmar IT & Tech News",
  "nav.feed": "Feed",
  "nav.saved": "Saved",
  "nav.sources": "Sources",
  "nav.signIn": "Sign In",
  "nav.signOut": "Sign Out",

  // Feed & Search
  "feed.title": "Latest Tech & IT News",
  "feed.subtitle": "AI-enriched Myanmar & global tech stories in one place",
  "feed.searchPlaceholder": "Search articles or topics...",
  "feed.searchBtn": "Search",
  "feed.clearSearch": "Clear",
  "feed.mode.keyword": "Keyword",
  "feed.mode.semantic": "AI Semantic",
  "feed.lang.all": "All Languages",
  "feed.lang.en": "English",
  "feed.lang.my": "Myanmar",
  "feed.sentiment.all": "All Sentiments",
  "feed.sentiment.positive": "Positive",
  "feed.sentiment.neutral": "Neutral",
  "feed.sentiment.negative": "Negative",
  "feed.loading": "Loading articles...",
  "feed.emptyTitle": "No articles found",
  "feed.emptyDesc": "Try adjusting your search query or filters.",
  "feed.loadMore": "Load More",
  "feed.showing": "Showing {count} of {total} articles",

  // Saved
  "saved.title": "Saved Articles",
  "saved.subtitle": "Your bookmarked tech stories for later reading",
  "saved.emptyTitle": "No saved articles yet",
  "saved.emptyDesc": "Bookmark articles from the feed to read them anytime.",
  "saved.browseBtn": "Browse Feed",
  "saved.signInPrompt": "Sign in to view and sync your saved articles.",
  "saved.removeBtn": "Remove",

  // Article Details
  "article.backToFeed": "Back to Feed",
  "article.aiSummary": "AI Summary",
  "article.biasNotes": "Bias & Context Notes",
  "article.readOriginal": "Read Original Article",
  "article.save": "Save Article",
  "article.saved": "Saved",
  "article.publishedAt": "Published",
  "article.source": "Source",
  "article.sentiment.positive": "Positive",
  "article.sentiment.neutral": "Neutral",
  "article.sentiment.negative": "Negative",
  "article.noBody": "Full article text is available on the original source.",

  // Admin Sources
  "sources.title": "News Sources",
  "sources.subtitle": "Manage RSS feeds and scraper sources",
  "sources.addBtn": "Add Source",
  "sources.addingBtn": "Adding...",
  "sources.nameLabel": "Source Name",
  "sources.urlLabel": "Website URL",
  "sources.rssLabel": "RSS Feed URL (optional)",
  "sources.languageLabel": "Language",
  "sources.active": "Active",
  "sources.inactive": "Inactive",
  "sources.toggleActive": "Toggle Status",
  "sources.delete": "Delete",
  "sources.lastScraped": "Last scraped",
  "sources.never": "Never",
  "sources.empty": "No news sources configured yet.",

  // Offline
  "offline.title": "You are offline",
  "offline.desc":
    "Please check your internet connection. Previously cached pages and saved articles may still be available.",
  "offline.retry": "Try Again",

  // Footer
  "footer.tagline": "AI-powered Myanmar IT & Tech news aggregator.",
  "footer.feed": "Feed",
  "footer.saved": "Saved",
  "footer.sources": "Sources",
  "footer.copyright": "© {year} Axel News. All rights reserved.",
} as const;

export type TranslationKey = keyof typeof en;

const my: Record<TranslationKey, string> = {
  // Brand & Header
  "brand.name": "Axel News",
  "brand.tagline": "မြန်မာ အိုင်တီနှင့် နည်းပညာသတင်းများ",
  "nav.feed": "သတင်းစာမျက်နှာ",
  "nav.saved": "သိမ်းထားသည်",
  "nav.sources": "သတင်းရင်းမြစ်များ",
  "nav.signIn": "ဝင်ရောက်မည်",
  "nav.signOut": "ထွက်မည်",

  // Feed & Search
  "feed.title": "နောက်ဆုံးရ နည်းပညာသတင်းများ",
  "feed.subtitle": "AI ဖြင့် အကျဉ်းချုပ်ထားသော မြန်မာနှင့် နိုင်ငံတကာ အိုင်တီသတင်းများ",
  "feed.searchPlaceholder": "သတင်း သို့မဟုတ် ခေါင်းစဉ် ရှာဖွေရန်...",
  "feed.searchBtn": "ရှာမည်",
  "feed.clearSearch": "ရှင်းမည်",
  "feed.mode.keyword": "စာလုံးဖြင့်",
  "feed.mode.semantic": "AI အဓိပ္ပာယ်ဖြင့်",
  "feed.lang.all": "ဘာသာစကား အားလုံး",
  "feed.lang.en": "အင်္ဂလိပ်",
  "feed.lang.my": "မြန်မာ",
  "feed.sentiment.all": "သဘောထား အားလုံး",
  "feed.sentiment.positive": "အပြုသဘော",
  "feed.sentiment.neutral": "ကြားနေ",
  "feed.sentiment.negative": "အပျက်သဘော",
  "feed.loading": "သတင်းများ ဖတ်ရှုနေသည်...",
  "feed.emptyTitle": "သတင်း မတွေ့ရှိပါ",
  "feed.emptyDesc": "ရှာဖွေမှုစာသား သို့မဟုတ် Filter များကို ပြောင်းလဲစမ်းကြည့်ပါ။",
  "feed.loadMore": "ထပ်မံကြည့်ရှုမည်",
  "feed.showing": "စုစုပေါင်း {total} ပုဒ်မှ {count} ပုဒ် ပြသနေသည်",

  // Saved
  "saved.title": "သိမ်းဆည်းထားသော သတင်းများ",
  "saved.subtitle": "နောက်မှ ပြန်လည်ဖတ်ရှုရန် မှတ်သားထားသော သတင်းများ",
  "saved.emptyTitle": "သိမ်းဆည်းထားသော သတင်း မရှိသေးပါ",
  "saved.emptyDesc": "သတင်းစာမျက်နှာမှ နှစ်သက်ရာသတင်းများကို သိမ်းဆည်းထားနိုင်ပါတယ်။",
  "saved.browseBtn": "သတင်းများ ကြည့်မည်",
  "saved.signInPrompt": "သိမ်းထားသော သတင်းများကို ကြည့်ရှုရန် အကောင့်ဝင်ပါ။",
  "saved.removeBtn": "ဖယ်ရှားမည်",

  // Article Details
  "article.backToFeed": "သတင်းစာမျက်နှာသို့ ပြန်သွားရန်",
  "article.aiSummary": "AI အကျဉ်းချုပ်",
  "article.biasNotes": "ဘက်လိုက်မှုနှင့် နောက်ခံမှတ်ချက်",
  "article.readOriginal": "မူရင်းသတင်း ဖတ်ရှုရန်",
  "article.save": "သိမ်းဆည်းမည်",
  "article.saved": "သိမ်းပြီး",
  "article.publishedAt": "ထုတ်ဝေသည့်ရက်",
  "article.source": "ရင်းမြစ်",
  "article.sentiment.positive": "အပြုသဘော",
  "article.sentiment.neutral": "ကြားနေ",
  "article.sentiment.negative": "အပျက်သဘော",
  "article.noBody": "သတင်းအပြည့်အစုံကို မူရင်းဝက်ဘ်ဆိုက်တွင် ဖတ်ရှုနိုင်ပါသည်။",

  // Admin Sources
  "sources.title": "သတင်းရင်းမြစ်များ",
  "sources.subtitle": "RSS feed နှင့် Scraper ရင်းမြစ်များကို စီမံခန့်ခွဲပါ",
  "sources.addBtn": "ရင်းမြစ်အသစ် ထည့်မည်",
  "sources.addingBtn": "ထည့်နေသည်...",
  "sources.nameLabel": "ရင်းမြစ်အမည်",
  "sources.urlLabel": "ဝက်ဘ်ဆိုက် URL",
  "sources.rssLabel": "RSS Feed URL (Optional)",
  "sources.languageLabel": "ဘာသာစကား",
  "sources.active": "ဖွင့်ထားသည်",
  "sources.inactive": "ပိတ်ထားသည်",
  "sources.toggleActive": "အခြေအနေ ပြောင်းမည်",
  "sources.delete": "ဖျက်မည်",
  "sources.lastScraped": "နောက်ဆုံးရယူချိန်",
  "sources.never": "မရှိသေးပါ",
  "sources.empty": "သတင်းရင်းမြစ် မထည့်ရသေးပါ။",

  // Offline
  "offline.title": "အင်တာနက် ချိတ်ဆက်မှု ပြတ်တောက်နေပါသည်",
  "offline.desc":
    "သင့်အင်တာနက်လိုင်းကို စစ်ဆေးပါ။ ကြိုတင်သိမ်းဆည်းထားသော စာမျက်နှာများကို ဆက်လက်ဖတ်ရှုနိုင်ပါသည်။",
  "offline.retry": "ထပ်မံကြိုးစားမည်",

  // Footer
  "footer.tagline": "AI စနစ်သုံး မြန်မာ အိုင်တီနှင့် နည်းပညာသတင်း စုစည်းမှု။",
  "footer.feed": "သတင်းများ",
  "footer.saved": "သိမ်းထားသည်",
  "footer.sources": "ရင်းမြစ်များ",
  "footer.copyright": "© {year} Axel News. မူပိုင်ခွင့်အားလုံး ထိန်းသိမ်းထားသည်။",
};

export function translate(
  lang: Language,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const dict = lang === "my" ? my : en;
  let text = dict[key] ?? en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}

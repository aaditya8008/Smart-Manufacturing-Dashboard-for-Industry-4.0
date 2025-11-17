from fastapi import APIRouter, Query
import feedparser
from urllib.parse import quote_plus
from app.config import NEWS_RSS_TEMPLATE

router = APIRouter()

@router.get("/trends")
def get_trends(q: str = Query("industry 4.0 OR manufacturing OR smart factory", min_length=1), limit: int = 12):
    # Fetch Google News RSS search results for q
    rss_url = NEWS_RSS_TEMPLATE.format(q=quote_plus(q))
    feed = feedparser.parse(rss_url)
    results = []
    for i, entry in enumerate(feed.entries[:limit]):
        # extract summary/description safely
        summary = entry.get("summary", "") or entry.get("description", "")
        source = entry.get("source", {}).get("title", None)
        published = entry.get("published", entry.get("updated", None))
        results.append({
            "title": entry.get("title"),
            "summary": summary,
            "source": source,
            "publishedAt": entry.get("published") or entry.get("updated"),
            "url": entry.get("link") or entry.get("id"),
            "categories": [t.term for t in entry.get("tags", [])] if entry.get("tags") else []
        })
    return {"status":"ok", "count": len(results), "items": results}

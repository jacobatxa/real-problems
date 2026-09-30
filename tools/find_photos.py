"""Search Openverse for openly licensed photo candidates and write a review sheet.

python3 tools/find_photos.py tools/photo_queries.json .review/sheet.html
"""
import html
import json
import sys
import time
import urllib.parse
import urllib.request

API = "https://api.openverse.org/v1/images/"
UA = "SolveRealProblem/1.0 (https://solverealproblem.com)"
PER_PROBLEM = 12


def search(query):
    params = {
        "q": query, "license": "by,by-sa,cc0,pdm", "aspect_ratio": "wide",
        "size": "large", "source": "flickr,wikimedia", "page_size": 20,
        "mature": "false",
    }
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers={"User-Agent": UA})
    try:
        data = json.load(urllib.request.urlopen(req, timeout=30))
    except Exception as e:
        print("  fail", query, e, file=sys.stderr)
        return []
    out = []
    for r in data.get("results", []):
        if not r.get("width") or r["width"] < 1400:
            continue
        if r["url"].lower().endswith((".png", ".svg", ".gif", ".tif", ".tiff")):
            continue
        out.append({
            "id": r["id"], "title": r.get("title") or "", "url": r["url"],
            "thumb": r.get("thumbnail") or r["url"], "page": r.get("foreign_landing_url") or "",
            "license": (r.get("license") or "").upper(), "license_version": r.get("license_version") or "",
            "creator": r.get("creator") or "", "source": r.get("source") or "",
            "w": r["width"], "h": r["height"],
        })
    return out


def main():
    queries = json.load(open(sys.argv[1], encoding="utf-8"))
    found = {}
    for pid, qs in queries.items():
        seen, cands = set(), []
        for q in qs:
            for c in search(q):
                if c["id"] not in seen:
                    seen.add(c["id"])
                    cands.append(c)
            time.sleep(1.2)
        found[pid] = cands[:PER_PROBLEM]
        print(pid, len(cands), file=sys.stderr)
    json.dump(found, open(sys.argv[2] + ".json", "w"), ensure_ascii=False, indent=1)
    rows = []
    for pid, cands in found.items():
        cells = "".join(
            f'<figure><img loading="lazy" src="{html.escape(c["thumb"])}"><figcaption>{i}</figcaption></figure>'
            for i, c in enumerate(cands)
        )
        rows.append(f"<h2>{pid}</h2><div class=row>{cells}</div>")
    page = ("<meta charset=utf-8><style>body{font:13px sans-serif;margin:8px;background:#111;color:#fff}"
            "h2{margin:6px 0 3px;font-size:14px}.row{display:grid;grid-template-columns:repeat(12,1fr);gap:4px}"
            "img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;background:#333}figure{margin:0;position:relative}"
            "figcaption{position:absolute;top:2px;left:4px;font:bold 14px sans-serif;text-shadow:0 0 3px #000}</style>" + "".join(rows))
    open(sys.argv[2], "w", encoding="utf-8").write(page)


if __name__ == "__main__":
    main()

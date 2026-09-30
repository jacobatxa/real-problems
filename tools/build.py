"""Merge data/*.json into assets/problems.js.

Run from the repo root: python3 tools/build.py
"""
import glob
import json
from urllib.parse import urlparse

PUBLISHERS = {
    "who.int": "WHO",
    "worldbank.org": "World Bank",
    "unesco.org": "UNESCO",
    "unicef.org": "UNICEF",
    "itu.int": "ITU",
    "unep.org": "UNEP",
    "fao.org": "FAO",
    "weforum.org": "World Economic Forum",
    "oecd.org": "OECD",
    "un.org": "United Nations",
    "stats.gov.cn": "国家统计局",
    "people.com.cn": "人民日报",
    "cyol.com": "中国青年报",
    "moe.gov.cn": "教育部",
    "nhc.gov.cn": "国家卫健委",
    "gov.cn": "中国政府网",
    "wmo.int": "WMO",
    "ipbes.net": "IPBES",
    "undrr.org": "UNDRR",
    "iea.org": "IEA",
    "unhcr.org": "UNHCR",
    "iom.int": "IOM",
    "ifad.org": "IFAD",
    "wfp.org": "WFP",
    "unodc.org": "UNODC",
    "interpol.int": "INTERPOL",
    "nature.com": "Nature",
    "thelancet.com": "The Lancet",
}

REQUIRED = [
    "id", "category", "title_zh", "title_en", "problem_zh", "problem_en",
    "fact_zh", "fact_en", "big_zh", "big_en", "big_label_zh", "big_label_en",
    "ai_angle_zh", "ai_angle_en", "junior_project_zh", "junior_project_en",
    "level", "source_name", "source_url", "source_year",
]


def publisher(url, fallback):
    host = urlparse(url).netloc.lower()
    for domain, name in PUBLISHERS.items():
        if host == domain or host.endswith("." + domain):
            return name
    return fallback.split(":")[0].strip()


def main():
    items, seen = [], set()
    for path in sorted(glob.glob("data/*.json")):
        for p in json.load(open(path, encoding="utf-8")):
            if p["id"] in seen:
                continue
            missing = [k for k in REQUIRED if k not in p or p[k] in ("", None)]
            if missing:
                raise SystemExit(f"{path} {p.get('id')}: missing {missing}")
            seen.add(p["id"])
            p["publisher"] = publisher(p["source_url"], p["source_name"])
            items.append(p)
    with open("assets/problems.js", "w", encoding="utf-8") as f:
        f.write("window.PROBLEMS = ")
        json.dump(items, f, ensure_ascii=False, indent=1)
        f.write(";\n")
    print(len(items), "problems,", len({p["publisher"] for p in items}), "publishers")


if __name__ == "__main__":
    main()

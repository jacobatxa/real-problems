(function () {
  var FORM_URL = "https://kcnrbxhxlmpz.feishu.cn/share/base/shrcn7bNAtyBK6RR17E5qHsnmXe";

  var ICONS = {
    edu: '<path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z"/><path d="M7 10.5v4.5c0 1.4 2.2 3 5 3s5-1.6 5-3v-4.5"/>',
    health: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
    climate: '<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z"/><path d="M5 19 13 11"/>',
    access: '<circle cx="12" cy="5" r="1.8"/><path d="M5 9h14M12 9v5m0 0-3 6m3-6 3 6"/>',
    community: '<path d="M4 20V10l5-4 5 4v10"/><path d="M14 20v-7h6v7M3 20h18"/>',
    food: '<path d="M12 21V11"/><path d="M12 11c0-4 3-6 6-6 0 4-3 6-6 6Zm0 0c0-3-2-5-5-5 0 3 2 5 5 5Z"/>',
    safety: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'
  };
  var CATS = {
    edu: { zh: "教育", en: "Education" },
    health: { zh: "健康", en: "Health" },
    climate: { zh: "环境与气候", en: "Climate" },
    access: { zh: "无障碍与包容", en: "Accessibility" },
    community: { zh: "社区与城市", en: "Community" },
    food: { zh: "食物与农业", en: "Food" },
    safety: { zh: "安全与信息", en: "Safety" }
  };
  var LEVEL = {
    1: { zh: "入门", en: "Starter" },
    2: { zh: "进阶", en: "Intermediate" },
    3: { zh: "挑战", en: "Challenge" }
  };
  var DIMS = [
    { zh: "真实", en: "Real", dzh: "有具体的人和场景，有数据或亲身经历", den: "Specific people and moments, backed by data or experience" },
    { zh: "影响", en: "Impact", dzh: "受影响的人多不多，困扰重不重", den: "How many people it touches, and how much" },
    { zh: "AI 能帮", en: "AI fit", dzh: "AI 能做一件具体的事：识别、翻译、总结、提醒、预测", den: "AI can do one concrete job: recognise, translate, summarise, remind, predict" },
    { zh: "孩子能做", en: "Doable", dzh: "几周内能做出第一版，工具和数据拿得到", den: "A first version in a few weeks, with tools and data within reach" },
    { zh: "能验证", en: "Testable", dzh: "做完能找到真实的人试用、给反馈", den: "Real people can try it and give feedback" }
  ];

  function svg(path, sw) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round">' + path + "</svg>";
  }
  function bi(zh, en) {
    return '<span data-l="zh">' + zh + '</span><span data-l="en">' + en + "</span>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* language */
  var lang = "zh";
  function setLang(l) {
    lang = l;
    document.documentElement.setAttribute("data-lang", l);
    document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
    try { localStorage.setItem("rp-lang", l); } catch (e) {}
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.set === l);
    });
    var t = document.querySelector("title");
    if (t && t.dataset[l]) t.textContent = t.dataset[l];
    document.querySelectorAll("[data-ph-zh]").forEach(function (i) {
      i.placeholder = i.getAttribute("data-ph-" + l);
    });
  }
  var q = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("rp-lang"); } catch (e) {}
  setLang((q || saved) === "en" ? "en" : "zh");
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".lang button");
    if (b) setLang(b.dataset.set);
  });

  document.querySelectorAll("[data-form]").forEach(function (a) { a.href = FORM_URL; });
  var frame = document.getElementById("formFrame");
  if (frame) frame.src = FORM_URL;

  /* rubric */
  var dims = document.getElementById("dims");
  if (dims) {
    var star = svg('<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z" fill="currentColor"/>', 1.2);
    dims.innerHTML = DIMS.map(function (d) {
      return '<div class="dim"><h4>' + bi(d.zh, d.en) + "</h4><p>" + bi(d.dzh, d.den) + '</p><span class="stars">' + star + star + star + "</span></div>";
    }).join("") +
      '<div class="gate">' + bi("<b>安全底线</b>：涉及隐私、危险、医疗诊断的问题，孩子不直接参与，总分记为 0。", "<b>Safety gate</b>: problems involving private data, danger, or medical diagnosis score 0, and young people do not work on them directly.") + "</div>" +
      '<div class="score-rule"><span>' + bi("满分 <b>15</b>", "Max <b>15</b>") + "</span><span>" + bi("<b>10+</b> 上墙", "<b>10+</b> on the wall") + "</span><span>" + bi("<b>12+</b> 且有导师：组队", "<b>12+</b> with a mentor: team up") + "</span></div>";
  }

  /* problems */
  var data = (function (raw) {
    var groups = {}, order = [], out = [];
    raw.forEach(function (p) {
      if (!groups[p.category]) { groups[p.category] = []; order.push(p.category); }
      groups[p.category].push(p);
    });
    for (var i = 0; out.length < raw.length; i++) {
      order.forEach(function (c) { if (groups[c][i]) out.push(groups[c][i]); });
    }
    return out;
  })(window.PROBLEMS || []);
  var cards = document.getElementById("cards");
  if (!cards) return;

  function levelDots(n) {
    var h = '<span class="level">';
    for (var i = 1; i <= 3; i++) h += '<i class="' + (i <= n ? "f" : "") + '"></i>';
    return h + "<em>" + bi(LEVEL[n].zh, LEVEL[n].en) + "</em></span>";
  }
  function catTag(cat) {
    return '<span class="cat">' + svg(ICONS[cat]) + bi(CATS[cat].zh, CATS[cat].en) + "</span>";
  }
  function card(p) {
    return '<button type="button" class="card cat-' + p.category + '" data-id="' + esc(p.id) + '">' +
      '<div class="hd"><span class="ico">' + svg(ICONS[p.category], 1.4) + "</span>" + catTag(p.category) +
      '<div class="big">' + bi(esc(p.big_zh), esc(p.big_en)) + "</div>" +
      '<div class="big-label">' + bi(esc(p.big_label_zh), esc(p.big_label_en)) + "</div></div>" +
      '<div class="bd"><h3>' + bi(esc(p.title_zh), esc(p.title_en)) + "</h3>" +
      "<p>" + bi(esc(p.problem_zh), esc(p.problem_en)) + "</p>" +
      '<div class="ft">' + levelDots(p.level) + '<span class="src">' + esc(p.publisher || p.source_name) + "</span></div></div></button>";
  }

  var used = Object.keys(CATS).filter(function (c) {
    return data.some(function (p) { return p.category === c; });
  });
  var sources = {};
  data.forEach(function (p) { sources[p.publisher || p.source_name] = 1; });
  function countUp(id, n) {
    var el = document.getElementById(id), i = 0;
    if (!el) return;
    var t = setInterval(function () {
      i = Math.min(n, i + Math.max(1, Math.round(n / 20)));
      el.textContent = i;
      if (i >= n) clearInterval(t);
    }, 35);
  }
  countUp("statProblems", data.length);
  countUp("statCats", used.length);
  countUp("statSources", Object.keys(sources).length);

  var state = { cat: "all", level: 0, q: "" };
  var chips = document.getElementById("chips");
  function chip(attr, val, label, icon, n, cls) {
    return '<button type="button" class="chip ' + (cls || "") + '" data-' + attr + '="' + val + '">' + (icon ? svg(icon) : "") + label + (n != null ? ' <span class="n">' + n + "</span>" : "") + "</button>";
  }
  chips.innerHTML = chip("cat", "all", bi("全部", "All"), null, data.length, "on") +
    used.map(function (c) {
      var n = data.filter(function (p) { return p.category === c; }).length;
      return chip("cat", c, bi(CATS[c].zh, CATS[c].en), ICONS[c], n, "cat-" + c);
    }).join("") +
    '<span class="sep"></span>' +
    chip("level", 1, bi("适合入门", "Starter friendly"), '<path d="M5 12h14M12 5l7 7-7 7"/>');

  function matches(p) {
    if (state.cat !== "all" && p.category !== state.cat) return false;
    if (state.level && p.level !== state.level) return false;
    if (state.q) {
      var hay = [p.title_zh, p.title_en, p.problem_zh, p.problem_en, p.ai_angle_zh, p.ai_angle_en, p.big_label_zh, p.big_label_en].join(" ").toLowerCase();
      return state.q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
    }
    return true;
  }
  function draw() {
    var list = data.filter(matches);
    cards.innerHTML = list.length ? list.map(card).join("") :
      '<p class="empty">' + bi("没找到相关的问题。也许你可以提交一个？", "Nothing matches yet. Maybe you could submit one?") + "</p>";
    var title = document.getElementById("wallTitle");
    var name = state.cat === "all" ? null : CATS[state.cat];
    title.innerHTML = bi((name ? name.zh + " · " : "全部问题 · ") + list.length + " 个", (name ? name.en + " · " : "All problems · ") + list.length);
  }
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    if (b.dataset.cat) {
      state.cat = b.dataset.cat;
      chips.querySelectorAll("[data-cat]").forEach(function (x) { x.classList.toggle("on", x === b); });
    } else {
      state.level = state.level ? 0 : 1;
      b.classList.toggle("on", !!state.level);
    }
    draw();
  });
  document.getElementById("q").addEventListener("input", function (e) {
    state.q = e.target.value.trim().toLowerCase();
    draw();
  });
  draw();

  var dlg = document.getElementById("detail");
  function openDetail(id) {
    var p = data.find(function (x) { return x.id === id; });
    if (!p) return;
    dlg.className = "detail cat-" + p.category;
    dlg.querySelector(".inner").innerHTML =
      '<button class="close" type="button" aria-label="Close">' + svg('<path d="M6 6l12 12M18 6 6 18"/>', 2.2) + "</button>" +
      '<div class="hd"><span class="ico">' + svg(ICONS[p.category], 1.4) + "</span>" + catTag(p.category) +
      "<h3>" + bi(esc(p.title_zh), esc(p.title_en)) + "</h3></div>" +
      '<div class="body">' +
      '<div class="row"><b>' + bi("问题是什么", "The problem") + "</b><p>" + bi(esc(p.problem_zh), esc(p.problem_en)) + "</p></div>" +
      '<div class="row fact"><div class="big">' + bi(esc(p.big_zh), esc(p.big_en)) + "</div><div><p>" + bi(esc(p.fact_zh), esc(p.fact_en)) + "</p>" +
      '<a href="' + esc(p.source_url) + '" target="_blank" rel="noopener">' + bi("来源：", "Source: ") + esc(p.source_name) + (p.source_year ? ", " + esc(p.source_year) : "") + "</a></div></div>" +
      '<div class="row"><b>' + bi("AI 可以怎么帮", "How AI could help") + "</b><p>" + bi(esc(p.ai_angle_zh), esc(p.ai_angle_en)) + "</p></div>" +
      '<div class="row project"><b>' + bi("第一个项目可以这样做", "A first project") + "</b><p>" + bi(esc(p.junior_project_zh), esc(p.junior_project_en)) + "</p></div>" +
      '<p class="soon">' + levelDots(p.level) + "&nbsp;&nbsp;" + bi("组队报名即将开放。", "Team sign-up opens soon.") + "</p></div>";
    dlg.showModal();
    dlg.querySelector(".inner").scrollTop = 0;
  }
  document.addEventListener("click", function (e) {
    var c = e.target.closest(".card[data-id]");
    if (c) return openDetail(c.dataset.id);
    if (e.target.closest(".close") || e.target === dlg) dlg.close();
  });
})();

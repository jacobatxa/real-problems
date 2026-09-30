(function () {
  var FORM_URL = "https://kcnrbxhxlmpz.feishu.cn/share/base/shrcn7bNAtyBK6RR17E5qHsnmXe";

  var CATS = {
    edu: { zh: "教育", en: "Education" },
    health: { zh: "健康", en: "Health" },
    climate: { zh: "环境与气候", en: "Climate" },
    access: { zh: "无障碍与包容", en: "Access" },
    community: { zh: "社区与城市", en: "Community" },
    food: { zh: "食物与农业", en: "Food" },
    safety: { zh: "安全与信息", en: "Safety" }
  };
  var LEVEL = { 1: { zh: "入门", en: "Starter" }, 2: { zh: "进阶", en: "Intermediate" }, 3: { zh: "挑战", en: "Challenge" } };
  var STATUS = { open: { zh: "开放", en: "Open" }, team: { zh: "组队中", en: "Team forming" }, build: { zh: "进行中", en: "In progress" }, shipped: { zh: "已上线", en: "Shipped" } };
  var ARROW = '<svg class="ar" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M0 5h15M11 1l4 4-4 4"/></svg>';

  function bi(zh, en) { return '<span data-l="zh">' + zh + '</span><span data-l="en">' + en + "</span>"; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function T(p, k) { return bi(esc(p[k + "_zh"]), esc(p[k + "_en"])); }
  function photo(p) {
    if (p.photo && p.photo.src) return '<div class="ph" style="background-image:url(\'' + esc(p.photo.src) + '\')"></div>';
    return '<div class="ph fallback"></div>';
  }
  function link(p) { return "problem.html?id=" + encodeURIComponent(p.id); }

  var data = (window.PROBLEMS || []).map(function (p, i) {
    p.code = "RP-" + String(i + 1).padStart(3, "0");
    p.status = p.status || "open";
    return p;
  });

  /* chrome */
  var page = document.body.dataset.page;
  var header = document.createElement("header");
  header.className = "top";
  header.innerHTML = '<div class="wrap">' +
    '<a class="brand" href="index.html"><span class="mk"></span><b>Solve Real Problem</b><small data-l="zh">真问题</small></a>' +
    '<nav class="nav">' +
    '<a href="index.html#missions" class="hide-sm' + (page === "mission" ? " on" : "") + '">' + bi("任务", "Missions") + "</a>" +
    '<a href="index.html#checklist" class="hide-sm">' + bi("怎么挑选", "How we choose") + "</a>" +
    '<a href="submit.html"' + (page === "submit" ? ' class="on"' : "") + ">" + bi("提交问题", "Propose") + "</a>" +
    '<div class="lang"><button type="button" data-set="zh">中</button><button type="button" data-set="en">EN</button></div>' +
    "</nav></div>";
  document.body.prepend(header);
  var footer = document.createElement("footer");
  footer.innerHTML = '<div class="wrap"><span class="mono">Solve Real Problem · solverealproblem.com</span>' +
    '<span class="mono">' + bi("把世界上的真问题，变成孩子们的真项目", "Real problems, real projects, young builders") + "</span></div>";
  document.body.append(footer);

  function onScroll() {
    header.classList.toggle("solid", window.scrollY > 40 || page === "submit");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* language */
  function setLang(l) {
    document.documentElement.setAttribute("data-lang", l);
    document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
    try { localStorage.setItem("rp-lang", l); } catch (e) {}
    document.querySelectorAll(".lang button").forEach(function (b) { b.classList.toggle("on", b.dataset.set === l); });
    document.querySelectorAll("[data-ph-zh]").forEach(function (i) { i.placeholder = i.getAttribute("data-ph-" + l); });
    var t = document.querySelector("title");
    if (t && t.dataset[l]) t.textContent = t.dataset[l];
  }
  var q = new URLSearchParams(location.search).get("lang"), saved = null;
  try { saved = localStorage.getItem("rp-lang"); } catch (e) {}
  setLang((q || saved) === "en" ? "en" : "zh");
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".lang button");
    if (b) setLang(b.dataset.set);
  });

  document.querySelectorAll("[data-form]").forEach(function (a) { a.href = FORM_URL; });
  var frame = document.getElementById("formFrame");
  if (frame) frame.src = FORM_URL;

  /* reveal on scroll */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  function watch(root) { (root || document).querySelectorAll(".rv:not(.in)").forEach(function (el) { io.observe(el); }); }

  function countUp(el, n) {
    if (!el) return;
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- home ---------- */
  if (page === "home") {
    var byCat = {}, featured = [];
    data.forEach(function (p) { (byCat[p.category] = byCat[p.category] || []).push(p); });
    Object.keys(CATS).forEach(function (c) {
      var list = (byCat[c] || []).slice().sort(function (a, b) { return (b.photo ? 1 : 0) - (a.photo ? 1 : 0); });
      if (list[0]) featured.push(list[0]);
    });

    var hero = document.getElementById("hero");
    var DUR = 7000;
    hero.style.setProperty("--dur", DUR + "ms");
    hero.innerHTML = featured.map(function (p, i) {
      return '<div class="slide cat-' + p.category + (i === 0 ? " on" : "") + '">' + photo(p) + '<div class="shade"></div>' +
        '<div class="copy"><div class="wrap">' +
        '<div class="meta mono"><span>' + p.code + "</span><span>" + bi(CATS[p.category].zh, CATS[p.category].en) + '</span><span class="st">' + bi(STATUS[p.status].zh, STATUS[p.status].en) + "</span></div>" +
        '<div class="big">' + T(p, "big") + "</div>" +
        '<div class="label">' + T(p, "big_label") + "</div>" +
        '<p class="title">' + T(p, "title") + "</p>" +
        '<a class="btn" href="' + link(p) + '">' + bi("查看任务", "View mission") + ARROW + "</a>" +
        "</div></div></div>";
    }).join("") +
      '<div class="dots"><span class="count mono" id="heroCount"></span><div class="bars">' +
      featured.map(function (_, i) { return '<button type="button" aria-label="' + (i + 1) + '"><i></i></button>'; }).join("") +
      '</div></div><span class="scroll mono">' + bi("向下滚动", "Scroll") + "</span>";

    var slides = hero.querySelectorAll(".slide"), bars = hero.querySelectorAll(".bars button"), cur = 0, timer;
    function go(i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("on", k === cur); });
      bars.forEach(function (b, k) {
        b.classList.remove("on");
        b.classList.toggle("done", k < cur);
        if (k === cur) { void b.offsetWidth; b.classList.add("on"); }
      });
      document.getElementById("heroCount").textContent = String(cur + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
      clearTimeout(timer);
      timer = setTimeout(function () { go(cur + 1); }, DUR);
    }
    bars.forEach(function (b, k) { b.addEventListener("click", function () { go(k); }); });
    go(0);

    var used = Object.keys(CATS).filter(function (c) { return byCat[c]; });
    var pubs = {};
    data.forEach(function (p) { pubs[p.publisher || p.source_name] = 1; });
    var tele = document.querySelectorAll(".telemetry b");
    var teleIO = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      countUp(tele[0], data.length);
      countUp(tele[1], used.length);
      countUp(tele[2], Object.keys(pubs).length);
      countUp(tele[3], 15);
      teleIO.disconnect();
    }, { threshold: 0.4 });
    teleIO.observe(document.querySelector(".telemetry"));

    /* manifest */
    var state = { cat: "all", q: "" };
    var tabs = document.getElementById("tabs");
    tabs.innerHTML = '<button type="button" class="on" data-cat="all">' + bi("全部", "All") + "<sup>" + data.length + "</sup></button>" +
      used.map(function (c) {
        return '<button type="button" data-cat="' + c + '">' + bi(CATS[c].zh, CATS[c].en) + "<sup>" + byCat[c].length + "</sup></button>";
      }).join("");
    var list = document.getElementById("list");
    function lv(n) { var h = '<span class="lv">'; for (var i = 1; i <= 3; i++) h += '<i class="' + (i <= n ? "f" : "") + '"></i>'; return h + "</span>"; }
    function row(p) {
      return '<a class="row cat-' + p.category + '" href="' + link(p) + '" data-id="' + esc(p.id) + '">' +
        '<span class="id">' + p.code + "</span>" +
        "<span><h3>" + T(p, "title") + '</h3><div class="sub">' + T(p, "big_label") + "</div></span>" +
        '<span class="area"><i></i>' + bi(CATS[p.category].zh, CATS[p.category].en) + "</span>" +
        '<span class="num">' + T(p, "big") + "</span>" +
        "<span>" + lv(p.level) + '<span class="mono" style="color:var(--dim);display:block;margin-top:6px;font-size:10px">' + bi(LEVEL[p.level].zh, LEVEL[p.level].en) + "</span></span>" +
        '<span class="st">' + bi(STATUS[p.status].zh, STATUS[p.status].en) + "</span>" +
        '<svg class="go-ar" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M0 5h15M11 1l4 4-4 4"/></svg></a>';
    }
    function draw() {
      var words = state.q ? state.q.split(/\s+/) : [];
      var shown = data.filter(function (p) {
        if (state.cat !== "all" && p.category !== state.cat) return false;
        if (!words.length) return true;
        var hay = [p.title_zh, p.title_en, p.problem_zh, p.problem_en, p.big_label_zh, p.big_label_en, p.code].join(" ").toLowerCase();
        return words.every(function (w) { return hay.indexOf(w) > -1; });
      });
      list.innerHTML = shown.length ? shown.map(row).join("") :
        '<p class="empty">' + bi("还没有相关的问题。也许你可以提交一个。", "Nothing here yet. Maybe you could propose one.") + "</p>";
    }
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      state.cat = b.dataset.cat;
      tabs.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      draw();
    });
    document.getElementById("find").addEventListener("input", function (e) { state.q = e.target.value.trim().toLowerCase(); draw(); });
    draw();

    var peek = document.getElementById("peek");
    if (window.matchMedia("(hover:hover)").matches) {
      list.addEventListener("mousemove", function (e) {
        var r = e.target.closest(".row");
        if (!r) { peek.classList.remove("on"); return; }
        if (peek.dataset.id !== r.dataset.id) {
          var p = data.find(function (x) { return x.id === r.dataset.id; });
          peek.dataset.id = p.id;
          peek.className = "peek cat-" + p.category;
          peek.innerHTML = photo(p);
        }
        peek.classList.add("on");
        var x = Math.min(window.innerWidth - 380, e.clientX + 28), y = Math.min(window.innerHeight - 245, e.clientY - 110);
        peek.style.left = x + "px";
        peek.style.top = Math.max(84, y) + "px";
      });
      list.addEventListener("mouseleave", function () { peek.classList.remove("on"); });
    }

    /* checklist lights up in sequence */
    var poll = document.querySelectorAll(".poll li");
    var pollIO = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      poll.forEach(function (li, i) { setTimeout(function () { li.classList.add("lit"); }, 350 * i); });
      pollIO.disconnect();
    }, { threshold: 0.35 });
    if (poll.length) pollIO.observe(poll[0].parentNode);

    var band = document.getElementById("bandPh");
    var withPhoto = data.filter(function (p) { return p.photo; });
    if (band && withPhoto.length) band.outerHTML = photo(withPhoto[withPhoto.length - 1]);
  }

  /* ---------- mission ---------- */
  if (page === "mission") {
    var id = new URLSearchParams(location.search).get("id");
    var idx = Math.max(0, data.findIndex(function (x) { return x.id === id; }));
    var p = data[idx];
    var prev = data[(idx - 1 + data.length) % data.length], next = data[(idx + 1) % data.length];
    var t = document.querySelector("title");
    t.dataset.zh = p.title_zh + " · 真问题";
    t.dataset.en = p.title_en + " · Solve Real Problem";
    t.textContent = document.documentElement.dataset.lang === "en" ? t.dataset.en : t.dataset.zh;

    var cr = p.photo ? '<p class="credit">' + bi("图片：", "Photo: ") + esc(p.photo.credit) + " / " +
      (p.photo.link ? '<a href="' + esc(p.photo.link) + '" target="_blank" rel="noopener">' + esc(p.photo.license) + "</a>" : esc(p.photo.license)) + "</p>" : "";

    document.getElementById("mission").innerHTML =
      '<section class="m-hero cat-' + p.category + '">' + photo(p) + '<div class="shade"></div>' +
      '<div class="copy"><div class="wrap">' +
      '<div class="meta mono"><span>' + p.code + "</span><span>" + bi(CATS[p.category].zh, CATS[p.category].en) + "</span><span>" + bi("难度 · " + LEVEL[p.level].zh, "Level · " + LEVEL[p.level].en) + '</span><span class="st">' + bi(STATUS[p.status].zh, STATUS[p.status].en) + "</span></div>" +
      "<h1>" + T(p, "title") + "</h1></div></div></section>" +
      '<div class="wrap cat-' + p.category + '"><div class="m-body">' +
      '<div class="lbl mono">01 / ' + bi("问题", "The problem") + '</div><div class="blk rv"><p>' + T(p, "problem") + "</p></div>" +
      '<div class="lbl mono">02 / ' + bi("数据", "The data") + '</div><div class="blk rv"><div class="data"><b>' + T(p, "big") + '</b><span class="lab">' + T(p, "big_label") + "</span>" +
      '<div class="fact">' + T(p, "fact") + "<br>" + bi("来源", "Source") + ' · <a href="' + esc(p.source_url) + '" target="_blank" rel="noopener">' + esc(p.source_name) + "</a> · " + esc(p.source_year) + "</div></div></div>" +
      '<div class="lbl mono">03 / ' + bi("AI 怎么帮", "Where AI helps") + '</div><div class="blk rv"><p>' + T(p, "ai_angle") + "</p></div>" +
      '<div class="lbl mono">04 / ' + bi("第一个项目", "First build") + '</div><div class="blk rv"><div class="project"><p>' + T(p, "junior_project") + "</p></div></div>" +
      '<div class="lbl mono">05 / ' + bi("任务参数", "Mission specs") + '</div><div class="blk rv"><div class="specs">' +
      '<div><span class="mono">' + bi("难度", "Level") + "</span><b>" + bi(LEVEL[p.level].zh, LEVEL[p.level].en) + "</b></div>" +
      '<div><span class="mono">' + bi("领域", "Area") + "</span><b>" + bi(CATS[p.category].zh, CATS[p.category].en) + "</b></div>" +
      '<div><span class="mono">' + bi("状态", "Status") + "</span><b>" + bi(STATUS[p.status].zh, STATUS[p.status].en) + "</b></div>" +
      "</div>" + cr + "</div>" +
      "</div>" +
      '<nav class="pager"><a href="' + link(prev) + '"><span class="mono">' + bi("上一个任务", "Previous") + " · " + prev.code + "</span><b>" + T(prev, "title") + "</b></a>" +
      '<a href="' + link(next) + '"><span class="mono">' + bi("下一个任务", "Next") + " · " + next.code + "</span><b>" + T(next, "title") + "</b></a></nav></div>" +
      '<div class="dock" id="dock"><div class="wrap"><div><div class="t">' + bi("想加入这个任务？", "Want to join this mission?") + '</div><div class="s">' +
      bi("组队报名即将开放。先提交你知道的问题，留下联系方式，开放时第一时间通知你。", "Team sign-up opens soon. Propose a problem and leave a contact to hear first.") +
      '</div></div><a class="btn fill" href="submit.html">' + bi("提交问题", "Propose") + ARROW + "</a></div></div>";

    var dock = document.getElementById("dock");
    window.addEventListener("scroll", function () { dock.classList.toggle("on", window.scrollY > window.innerHeight * 0.6); }, { passive: true });
  }

  watch();
})();

/* kafka-playlists.js v1
   Curated listening and watching playlists for kafka.blog.
   Mounts into any element with id="kplaylists" (the Watch & Listen page).
   Data is read live, so new posts join their playlist on their own:
     - posts, titles, photos, labels: the blog feed (/feeds/posts/summary)
     - narration: https://audio.kafka.blog/manifest.json (keyed by post path)
     - films:     https://audio.kafka.blog/video-manifest.json
   Nepali and English versions of the same piece become one row with a नेपाली / English switch. */
(function(){
  var root = document.getElementById("kplaylists");
  if (!root || root.getAttribute("data-kpl-ready")) return;
  root.setAttribute("data-kpl-ready", "1");

  var AUDIO = "https://audio.kafka.blog/";
  var LS = "kpl-lang";

  /* Pairs that the blog does not mark with a pair-* label yet (English path, Nepali path) */
  var EXTRA_PAIRS = [
    ["/2026/11/kushim-sukkalgir-first-names.html","/2026/11/kushim-sukkalgir-pahila-naam.html"],
    ["/2026/11/lobsters-dont-age-they-die-of-exhaustion-the-trade-off-multicellular-life-makes-with-death.html","/2026/11/lobster-budho-hudaina-telomerase.html"],
    ["/2026/11/the-mysterious-life-of-the-eel-guests-of-the-river-children-of-the-sea.html","/2026/11/bam-machha-rahasyamaya-jiwan.html"],
    ["/2026/11/faith-before-hunger-when-temples-gave-birth-to-villages-and-farming.html","/2026/11/faith-before-farming-gobekli-tepe-boncuklu-tarla.html"],
    ["/2026/10/covid-19-long-covid-and-the-old-diseases-it-reawakens.html","/2026/10/covid-long-covid-purana-rog.html"],
    ["/2026/10/cousin-marriage-genetic-disease-tutankhamun-habsburgs.html","/2026/10/mamachela-phupuchela-bihe-genetic-rog.html"],
    ["/2026/10/why-does-the-body-treat-a-new-kidney-as-an-enemy.html","/2026/10/mirgaula-pratyaropan-nepali.html"],
    ["/2026/10/elephant-and-cancer.html","/2026/10/hatti-lai-cancer-kina-lagdaina.html"],
    ["/2026/09/how-dna-copies-itself.html","/2026/09/jin-ra-dna-pratilipi.html"],
    ["/2026/09/we-have-beaten-cancer-in-mice-when-will-it-be-beaten-in-humans.html","/2026/09/musama-cancer-jitiyo-manisma-kahile.html"],
    ["/2026/09/rosalind-franklin-the-dark-lady-of-dna.html","/2026/09/rosalind-franklin-nepali.html"],
    ["/2026/11/lovers-of-solitude-slaves-of-crowd-how.html","/2026/11/phatyangra-salah-kasari-banchha.html"],
    ["/2026/11/how-salamandar-grows-its-limbs-story.html","/2026/11/thakthake-salamander-khutta-feri-palauchha.html"]
  ];

  /* Biology and Evolution and Cancer are hand-picked (by the English or Nepali path of each piece) */
  var BIO = ["how-dna-copies-itself","the-mysterious-life-of-the-eel","eels.html","lobsters-dont-age","lobsters.html","how-salamandar-grows","lovers-of-solitude","elephant-and-cancer","cousin-marriage","why-does-the-body-treat-a-new-kidney","darkantigens","rosalind-franklin-the-dark-lady","faith-before-hunger"];
  var CANCER = ["viruses-that-live-in-us-and-cancer","elephant-and-cancer","we-have-beaten-cancer-in-mice","pancreatic-cancer","darkantigens","lobsters-dont-age"];

  var SERIES = [
    {key:"pair-rb", en:"Roman Britannia", ne:"रोमन ब्रिटानियाको कथा"},
    {key:"pair-sumer", en:"Sumer: Between Two Rivers", ne:"सुमेर: दुई नदीको बीचमा"},
    {key:"pair-virus", en:"Viruses That Live in Us", ne:"शरीरमा डेरा जमाउने भाइरस"},
    {key:"pair-smallpox", en:"Smallpox in Nepal", ne:"नेपालमा बिफरको इतिहास"}
  ];

  function has(p, l){ return p.labels.indexOf(l) > -1; }
  function any(e, fn){ return (e.en && fn(e.en)) || (e.ne && fn(e.ne)); }
  function pathHas(e, list){ return any(e, function(p){ return list.some(function(s){ return p.path.indexOf(s) > -1; }); }); }

  var PLAYLISTS = [
    {id:"kabita", en:"Nepali Kabita", ne:"नेपाली कविता", lang:"ne", test:function(e){ return any(e,function(p){ return has(p,"Poetry") && p.lang === "ne"; }); }},
    {id:"poems", en:"English Poems", ne:"अङ्ग्रेजी कविता", lang:"en", test:function(e){ return any(e,function(p){ return has(p,"Poetry") && p.lang === "en"; }); }},
    {id:"letters", en:"Letters", ne:"चिठीहरू", test:function(e){ return any(e,function(p){ return has(p,"Letters") || p.role === "letter" && !has(p,"History"); }); }},
    {id:"series", en:"Series", ne:"शृङ्खला", series:true, test:function(){ return false; }},
    {id:"history", en:"History", ne:"इतिहास", test:function(e){ return any(e,function(p){ return has(p,"History") && !has(p,"Poetry"); }); }},
    {id:"science", en:"Science", ne:"विज्ञान", test:function(e){ return any(e,function(p){ return has(p,"Science"); }); }},
    {id:"bio", en:"Biology and Evolution", ne:"जीवविज्ञान र विकास", test:function(e){ return pathHas(e, BIO); }},
    {id:"cancer", en:"Cancer", ne:"क्यान्सर", test:function(e){ return pathHas(e, CANCER); }},
    {id:"published", en:"Published Articles", ne:"प्रकाशित लेख", test:function(e){ return any(e,function(p){ return has(p,"Published Articles"); }); }}
  ];

  var pref = "ne";
  try { pref = localStorage.getItem(LS) || (document.documentElement.lang === "en" ? "en" : "ne"); } catch(x){}

  function esc(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function clock(sec){ sec = Math.round(sec || 0); var m = Math.floor(sec/60), s = sec % 60; return m + ":" + (s < 10 ? "0" : "") + s; }
  function hours(sec){ var m = Math.round(sec/60); return m < 60 ? m + " min" : Math.floor(m/60) + " h " + (m % 60) + " min"; }
  function npNum(n, lang){ var s = String(n); return lang === "ne" ? s.replace(/\d/g, function(d){ return "०१२३४५६७८९"[d]; }) : s; }
  function cleanTitle(t){ return String(t || "").replace(/[।.]+\s*$/,"").trim(); }
  function bigThumb(u){ return u ? u.replace(/\/s\d+(-[a-z0-9-]+)?\//, "/s240-c/").replace(/=s\d+[^\/=]*$/, "=s240-c") : ""; }

  function loadFeed(){
    var out = [], step = 150;
    function page(start){
      return fetch("/feeds/posts/summary?alt=json&max-results=" + step + "&start-index=" + start).then(function(r){ return r.json(); }).then(function(j){
        var ents = (j.feed && j.feed.entry) || [];
        ents.forEach(function(e){
          var alt = (e.link || []).filter(function(l){ return l.rel === "alternate"; })[0];
          if (!alt) return;
          var labels = (e.category || []).map(function(c){ return c.term; });
          out.push({
            path: alt.href.replace(/^https?:\/\/[^\/]+/, "").split(/[?#]/)[0],
            title: cleanTitle(e.title.$t),
            date: (e.published.$t || "").slice(0,10),
            img: bigThumb((e.media$thumbnail || {}).url || ""),
            labels: labels,
            lang: labels.indexOf("lang-ne") > -1 ? "ne" : labels.indexOf("lang-en") > -1 ? "en" : (/[ऀ-ॿ]/.test(e.title.$t) ? "ne" : "en")
          });
        });
        var total = +((j.feed.openSearch$totalResults || {}).$t || 0);
        return (ents.length && start - 1 + ents.length < total) ? page(start + ents.length) : out;
      });
    }
    return page(1);
  }
  function getJSON(u){ return fetch(u + (u.indexOf("?") > -1 ? "&" : "?") + "p=" + Math.floor(Date.now()/120000), {cache:"default"}).then(function(r){ return r.ok ? r.json() : {}; }).catch(function(){ return {}; }); }

  function build(posts, audio, films){
    var byPath = {};
    posts.forEach(function(p){
      var a = audio[p.path];
      if (a){ p.role = a.role; p.f = a.f; p.m = a.m; p.sf = a.sf; p.sm = a.sm; }
      var v = films[p.path];
      if (v){ p.film = v; if (!v.img) v.img = p.img; }
      byPath[p.path] = p;
    });
    /* join Nepali and English versions */
    var entries = [], seen = {}, groups = {};
    posts.forEach(function(p){
      p.labels.forEach(function(l){ if (/^pair-/.test(l)){ (groups[l] = groups[l] || []).push(p); } });
    });
    function add(en, ne, key){
      if ((en && seen[en.path]) || (ne && seen[ne.path])) return;
      var e = {en: en || null, ne: ne || null, key: key || ""};
      if (en) seen[en.path] = e;
      if (ne) seen[ne.path] = e;
      entries.push(e);
    }
    Object.keys(groups).forEach(function(k){
      var g = groups[k], en = g.filter(function(p){ return p.lang === "en"; })[0], ne = g.filter(function(p){ return p.lang === "ne"; })[0];
      add(en, ne, k);
    });
    EXTRA_PAIRS.forEach(function(pr){ if (byPath[pr[0]] || byPath[pr[1]]) add(byPath[pr[0]], byPath[pr[1]]); });
    posts.forEach(function(p){ if (!seen[p.path]) add(p.lang === "en" ? p : null, p.lang === "ne" ? p : null); });
    entries = entries.filter(function(e){ return any(e, function(p){ return p.f || p.film; }); });
    entries.forEach(function(e){ e.date = [e.en && e.en.date, e.ne && e.ne.date].filter(Boolean).sort()[0]; });

    var lists = PLAYLISTS.map(function(pl){
      if (pl.series){
        var shelves = SERIES.map(function(s){
          var items = entries.filter(function(e){ return e.key.indexOf(s.key) === 0 && /\d+$/.test(e.key.slice(s.key.length)); });
          items.sort(function(a,b){ return parseInt(a.key.slice(s.key.length),10) - parseInt(b.key.slice(s.key.length),10); });
          return {en:s.en, ne:s.ne, items:items};
        }).filter(function(s){ return s.items.length; });
        return {pl:pl, shelves:shelves};
      }
      var items = entries.filter(pl.test);
      items.sort(function(a,b){ return a.date < b.date ? 1 : -1; });
      return {pl:pl, items:items};
    });
    render(lists);
  }

  /* which side of an entry to show */
  function side(e, lang){ return lang === "en" ? (e.en || e.ne) : (e.ne || e.en); }

  /* v3: the reader picks the narrator (female or male voice); remembered like the language */
  var VS = "kpl-voice", vpref = "f";
  try { vpref = localStorage.getItem(VS) === "m" ? "m" : "f"; } catch(x){}
  var state = {queue:[], idx:-1, lang:pref, voice:vpref, listName:""};
  function dur(p){ return (state.voice === "m" && p.sm) ? p.sm : (p.sf || 0); }
  function voiceSwitch(){
    var ne = state.lang === "ne";
    return '<div class="kpl-langsw kpl-voicesw" role="group" aria-label="' + (ne ? "वाचकको स्वर" : "Narrator voice") + '">' +
      '<button type="button" data-voice="f"' + (state.voice === "f" ? ' aria-pressed="true"' : ' aria-pressed="false"') + '>♀ ' + (ne ? "महिला स्वर" : "Female voice") + '</button>' +
      '<button type="button" data-voice="m"' + (state.voice === "m" ? ' aria-pressed="true"' : ' aria-pressed="false"') + '>♂ ' + (ne ? "पुरुष स्वर" : "Male voice") + '</button>' +
    '</div>';
  }
  function setVoice(v){
    if (v === state.voice) return;
    state.voice = v;
    try { localStorage.setItem(VS, v); } catch(x){}
    var playing = state.idx > -1 && !root.querySelector(".kpl-bar").hidden;
    var pos = playing ? audioEl.currentTime / (audioEl.duration || 1) : 0, wasPaused = audioEl.paused;
    render(root.__lists, true);
    if (playing){
      start();
      if (wasPaused) audioEl.pause();
      audioEl.addEventListener("loadedmetadata", function once(){ audioEl.currentTime = pos * audioEl.duration; audioEl.removeEventListener("loadedmetadata", once); });
    }
  }
  var audioEl = new Audio(); audioEl.preload = "none";

  function render(lists, keepBar){
    var html = '<header class="kpl-head">' +
      '<div class="kpl-hgroup"><p class="kpl-ne">हेर्नुहोस् र सुन्नुहोस्</p>' +
      '<p class="kpl-dek">' + (state.lang === "ne" ? "वाचन गरिएका कविता, लेख र चिठी, अनि तिनबाट बनेका चलचित्र।" : "Narrated poems, essays and letters, and the films made from them.") + '</p></div>' +
      '<div class="kpl-langsw" role="group" aria-label="Language">' +
        '<button type="button" data-lang="ne"' + (state.lang === "ne" ? ' aria-pressed="true"' : '') + '>नेपाली</button>' +
        '<button type="button" data-lang="en"' + (state.lang === "en" ? ' aria-pressed="true"' : '') + '>English</button>' +
      '</div>' + voiceSwitch() + '</header>' +
      '<nav class="kpl-jump" aria-label="Playlists">' + lists.map(function(L){ return '<a href="#kpl-' + L.pl.id + '">' + esc(state.lang === "ne" ? L.pl.ne : L.pl.en) + '</a>'; }).join("") + '</nav>' +
      '<div class="kpl-film" hidden><div class="kpl-film-stage"><video controls playsinline preload="metadata"></video></div><div class="kpl-film-meta"><b></b><button type="button" class="kpl-film-x" aria-label="Close film">Close</button></div></div>';
    lists.forEach(function(L){
      var pl = L.pl;
      if (L.shelves){
        html += '<section class="kpl-sec" id="kpl-' + pl.id + '">' + secHead(pl, L.shelves.reduce(function(n,s){ return n + s.items.length; },0), L.shelves.reduce(function(t,s){ return t + total(s.items); },0), false);
        L.shelves.forEach(function(s, si){
          html += '<div class="kpl-sub"><h3>' + esc(state.lang === "ne" ? s.ne : s.en) + ' <span>' + esc(state.lang === "ne" ? s.en : s.ne) + '</span></h3><button type="button" class="kpl-play-all" data-list="' + pl.id + ':' + si + '">' + (state.lang === "ne" ? "सबै बजाउनुहोस्" : "Play all") + '</button></div>';
          html += strip(s.items, pl.id + ":" + si);
        });
        html += '</section>';
      } else {
        html += '<section class="kpl-sec" id="kpl-' + pl.id + '">' + secHead(pl, L.items.length, total(L.items), true) + strip(L.items, pl.id) + '</section>';
      }
    });
    html += '<div class="kpl-bar" hidden><img class="kpl-bar-img" alt=""/><div class="kpl-bar-txt"><b></b><span></span></div>' +
      '<div class="kpl-bar-ctl"><button type="button" data-act="prev" aria-label="Previous">&#9198;</button><button type="button" data-act="toggle" class="kpl-bar-main" aria-label="Play or pause">&#9654;</button><button type="button" data-act="next" aria-label="Next">&#9197;</button></div>' +
      '<div class="kpl-bar-time"><span class="kpl-cur">0:00</span><input type="range" min="0" max="1000" value="0" aria-label="Seek"/><span class="kpl-dur">0:00</span></div>' +
      '<button type="button" data-act="voice" class="kpl-bar-voice" title="Switch narrator voice">' + (state.voice === "m" ? "♂" : "♀") + '</button><button type="button" data-act="close" class="kpl-bar-x" aria-label="Close player">×</button></div>';
    root.innerHTML = html;
    root.__lists = lists;
    wire();
  }
  function total(items){ return items.reduce(function(t,e){ var p = side(e, state.lang); return t + dur(p); }, 0); }
  function secHead(pl, n, sec, sortable){
    var ne = state.lang === "ne";
    return '<div class="kpl-sec-head"><h2>' + esc(ne ? pl.ne : pl.en) + ' <span>' + esc(ne ? pl.en : pl.ne) + '</span></h2>' +
      '<p>' + npNum(n, state.lang) + (ne ? " वटा · " : " pieces · ") + hours(sec) + '</p><div class="kpl-sec-ctl">' +
      (sortable ? '<div class="kpl-sort" role="group" aria-label="Order"><button type="button" data-sort="new" aria-pressed="true">' + (ne ? "नयाँ" : "Newest") + '</button><button type="button" data-sort="old">' + (ne ? "पुरानो" : "Oldest") + '</button></div>' : '') +
      (sortable ? '<button type="button" class="kpl-play-all" data-list="' + pl.id + '">' + (ne ? "सबै बजाउनुहोस्" : "Play all") + '</button>' : '') + '</div></div>';
  }
  function strip(items, listId){
    var rows = items.length >= 8 ? " kpl-two" : "";
    return '<ol class="kpl-strip' + rows + '" data-list="' + listId + '">' + items.map(function(e, i){ return card(e, i, listId); }).join("") + '</ol>';
  }
  function card(e, i, listId){
    var p = side(e, state.lang), both = e.en && e.ne;
    var film = (e.en && e.en.film) || (e.ne && e.ne.film);
    var bg = p.img ? ' style="--kbg:url(&quot;' + esc(p.img) + '&quot;)"' : '';
    return '<li class="kpl-item" data-i="' + i + '" data-list="' + listId + '"' + bg + '>' +
      '<button type="button" class="kpl-hit" aria-label="Play ' + esc(p.title) + '"></button>' +
      '<span class="kpl-pic">' + (p.img ? '<img loading="lazy" alt="" src="' + esc(p.img) + '"/>' : '') + '<i aria-hidden="true">&#9654;</i></span>' +
      '<span class="kpl-num">' + npNum(i + 1, state.lang) + '</span>' +
      '<span class="kpl-txt"><b lang="' + p.lang + '">' + esc(p.title) + '</b>' +
      '<span class="kpl-meta">' + (dur(p) ? clock(dur(p)) : "") + (both ? ' · <span class="kpl-pair">नेपाली + English</span>' : (p.lang === "ne" ? " · नेपाली" : " · English")) + '</span></span>' +
      '<span class="kpl-acts">' + (film ? '<button type="button" class="kpl-filmbtn" data-film="' + esc(film.path) + '">Film' + (film.duration ? ' ' + clock(film.duration) : '') + '</button>' : '') +
      '<a class="kpl-read" href="' + esc(p.path) + '">' + (p.lang === "ne" ? "पढ्नुहोस्" : "Read") + '</a></span></li>';
  }

  function listItems(listId){
    var parts = String(listId).split(":"), L = (root.__lists || []).filter(function(x){ return x.pl.id === parts[0]; })[0];
    if (!L) return [];
    var items = L.shelves ? (L.shelves[+parts[1]] || {items:[]}).items : L.items;
    var ol = root.querySelector('ol.kpl-strip[data-list="' + listId + '"]');
    return ol && ol.getAttribute("data-order") === "old" ? items.slice().reverse() : items;
  }

  function play(listId, i){
    var items = listItems(listId);
    state.queue = items.map(function(e){ return side(e, state.lang); }).filter(function(p){ return p.f; });
    var target = side(items[i] || items[0], state.lang);
    state.idx = Math.max(0, state.queue.indexOf(target));
    var parts = listId.split(":"), L = root.__lists.filter(function(x){ return x.pl.id === parts[0]; })[0];
    state.listName = L ? (L.shelves ? (state.lang === "ne" ? L.shelves[+parts[1]].ne : L.shelves[+parts[1]].en) : (state.lang === "ne" ? L.pl.ne : L.pl.en)) : "";
    start();
  }
  function start(){
    var p = state.queue[state.idx]; if (!p) return;
    var file = state.voice === "m" && p.m ? p.m : p.f;
    audioEl.src = AUDIO + file;
    audioEl.play().catch(function(){});
    fillBar(p);
  }
  function fillBar(p){
    if (!p) return;
    var bar = root.querySelector(".kpl-bar"); bar.hidden = false;
    bar.querySelector(".kpl-bar-img").src = p.img || "";
    bar.querySelector(".kpl-bar-txt b").textContent = p.title;
    bar.querySelector(".kpl-bar-txt span").textContent = state.listName + " · " + (state.idx + 1) + " / " + state.queue.length;
    Array.prototype.forEach.call(root.querySelectorAll(".kpl-item.is-on"), function(li){ li.classList.remove("is-on"); });
    Array.prototype.forEach.call(root.querySelectorAll('.kpl-item a.kpl-read[href="' + p.path + '"]'), function(a){ a.closest(".kpl-item").classList.add("is-on"); });
    if ("mediaSession" in navigator){
      try { navigator.mediaSession.metadata = new MediaMetadata({title:p.title, artist:"बासभ · Kafkaintherun", album:state.listName, artwork: p.img ? [{src:p.img, sizes:"240x240"}] : []});
        navigator.mediaSession.setActionHandler("nexttrack", function(){ step(1); });
        navigator.mediaSession.setActionHandler("previoustrack", function(){ step(-1); }); } catch(x){}
    }
  }
  function step(d){ var n = state.idx + d; if (n < 0 || n >= state.queue.length) return; state.idx = n; start(); }

  function showFilm(path){
    var v = filmsByPath[path]; if (!v) return;
    var box = root.querySelector(".kpl-film"), vid = box.querySelector("video");
    audioEl.pause();
    vid.poster = v.poster || String(v.img || "").replace(/=s\d+(-c)?$/, "=w1280").replace(/\/s\d+(-c)?\//, "/w1280/"); vid.src = v.src; box.hidden = false;
    box.querySelector("b").textContent = v.title;
    box.scrollIntoView({behavior:"smooth", block:"center"});
    vid.play().catch(function(){});
  }

  function wire(){
    /* render() runs again on a language or voice change; the click handler must only be added once */
    if (!root.__kplClick){ root.__kplClick = 1; root.addEventListener("click", function(ev){
      var t = ev.target;
      var lang = t.closest("[data-lang]");
      var vsw = t.closest("[data-voice]");
      if (vsw){ setVoice(vsw.getAttribute("data-voice")); return; }
      if (lang){ state.lang = lang.getAttribute("data-lang"); try { localStorage.setItem(LS, state.lang); } catch(x){} render(root.__lists); return; }
      var srt = t.closest("[data-sort]");
      if (srt){
        var sec = srt.closest(".kpl-sec"), ol = sec.querySelector("ol.kpl-strip"), want = srt.getAttribute("data-sort");
        if ((ol.getAttribute("data-order") || "new") !== want){
          Array.prototype.slice.call(ol.children).reverse().forEach(function(li, k){ ol.appendChild(li); li.setAttribute("data-i", k); var n = li.querySelector(".kpl-num"); if (n) n.textContent = npNum(k + 1, state.lang); });
          ol.setAttribute("data-order", want); ol.scrollLeft = 0;
        }
        Array.prototype.forEach.call(srt.parentNode.children, function(b){ b.setAttribute("aria-pressed", b === srt ? "true" : "false"); });
        return;
      }
      var all = t.closest(".kpl-play-all"); if (all){ play(all.getAttribute("data-list"), 0); return; }
      var fb = t.closest(".kpl-filmbtn"); if (fb){ showFilm(fb.getAttribute("data-film")); return; }
      if (t.closest(".kpl-film-x")){ var box = root.querySelector(".kpl-film"); box.querySelector("video").pause(); box.hidden = true; return; }
      if (t.closest("a")) return;
      var act = t.closest("[data-act]");
      if (act){
        var a = act.getAttribute("data-act");
        if (a === "toggle"){ if (audioEl.paused) audioEl.play(); else audioEl.pause(); }
        else if (a === "next") step(1);
        else if (a === "prev"){ if (audioEl.currentTime > 5) audioEl.currentTime = 0; else step(-1); }
        else if (a === "voice") setVoice(state.voice === "f" ? "m" : "f");
        else if (a === "close"){ audioEl.pause(); root.querySelector(".kpl-bar").hidden = true; state.idx = -1; }
        return;
      }
      var li = t.closest(".kpl-item");
      if (li){
        if (li.classList.contains("is-on")){ if (audioEl.paused) audioEl.play(); else audioEl.pause(); return; }
        play(li.getAttribute("data-list"), +li.getAttribute("data-i"));
      }
    }); }
    var bar = root.querySelector(".kpl-bar"), rng = bar.querySelector("input"), main = bar.querySelector(".kpl-bar-main");
    audioEl.ontimeupdate = function(){ if (!audioEl.duration) return; rng.value = Math.round(1000 * audioEl.currentTime / audioEl.duration); bar.querySelector(".kpl-cur").textContent = clock(audioEl.currentTime); bar.querySelector(".kpl-dur").textContent = clock(audioEl.duration); };
    audioEl.onplay = function(){ main.innerHTML = "&#10074;&#10074;"; root.classList.add("kpl-playing"); var v = root.querySelector(".kpl-film video"); if (v && !v.paused) v.pause(); };
    audioEl.onpause = function(){ main.innerHTML = "&#9654;"; root.classList.remove("kpl-playing"); };
    audioEl.onended = function(){ step(1); };
    rng.oninput = function(){ if (audioEl.duration) audioEl.currentTime = audioEl.duration * rng.value / 1000; };
    /* keep the player bar showing the current piece after a re-render */
    if (state.idx > -1 && audioEl.src){ fillBar(state.queue[state.idx]); main.innerHTML = audioEl.paused ? "&#9654;" : "&#10074;&#10074;"; }
  }

  var filmsByPath = {};
  root.innerHTML = '<p class="kpl-loading">Loading playlists…</p>';
  /* v2 (2026-11-27): R2's video manifest is now flat, {"/path.html": {slug, title, l, category, v16, v9}}.
     The older shape was {videos: {path: {src, poster, duration, ...}}}. Films that R2 no longer lists keep their
     src in video-captions.json on assets, so both files are read and merged. */
  var FILM_SKIP = {"/2025/04/hippies.html": 1};
  function filmList(man, cap){
    var out = {}, k;
    if (man && man.videos){ for (k in man.videos) out[k] = man.videos[k]; }
    else if (man){ for (k in man){ var e = man[k]; if (k.charAt(0) === "/" && e && e.v16) out[k] = {slug: e.slug, title: e.title, lang: e.l, src: AUDIO + e.v16}; } }
    var cv = (cap && cap.videos) || {};
    for (k in cv){
      if (!out[k] && !cv[k].src) continue;
      var m = out[k] || {}, c = cv[k], f;
      for (f in c) m[f] = c[f];
      out[k] = m;
    }
    for (k in FILM_SKIP) delete out[k];
    return out;
  }
  Promise.all([loadFeed(), getJSON(AUDIO + "manifest.json"), getJSON(AUDIO + "video-manifest.json"), getJSON("https://assets.kafka.blog/video-captions.json")]).then(function(r){
    var films = filmList(r[2], r[3]);
    Object.keys(films).forEach(function(k){ films[k].path = k; filmsByPath[k] = films[k]; });
    build(r[0], r[1] || {}, films);
    /* v2: search engines get the list of films on this page (ItemList pointing at each film's post) */
    try {
      if (!document.getElementById("kpl-schema")) {
        var keys = Object.keys(films).sort(function(a, b){ return String(films[b].uploadDate || "").localeCompare(String(films[a].uploadDate || "")); });
        var ld = {"@context": "https://schema.org", "@type": "ItemList", "name": "Watch and Listen: films by Basava (बासभ)",
          "itemListElement": keys.map(function(k, i){ return {"@type": "ListItem", "position": i + 1, "url": "https://www.kafka.blog" + k, "name": films[k].title || ""}; })};
        var sc = document.createElement("script"); sc.type = "application/ld+json"; sc.id = "kpl-schema"; sc.textContent = JSON.stringify(ld); document.head.appendChild(sc);
      }
    } catch (e) {}
  }).catch(function(){ root.innerHTML = '<p class="kpl-loading">The playlists could not load. Please refresh the page.</p>'; });
})();

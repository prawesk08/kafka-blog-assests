/* kafka-share.js v1 (2026-11-27)
   One share card for narrations and films: it always links back to the post they belong to,
   and offers WhatsApp, Facebook, X, copy link and Spotify. Also full screen for video.
   Used by kafka-post.js (the Listen panel on a post) and kafka-playlists.js (Watch & Listen).
   KShare.open({title, url, text, img, kind, lang, spotify})  opens the card
   KShare.spotify(path, lang, cb)                             cb(episode link, or the show link)
   KShare.fullscreen(stageEl, videoEl)                        toggles full screen
   KShare.icon(name)                                          svg markup */
(function(){
  if (window.KShare) return;
  var SHOW = {en: "https://open.spotify.com/show/43tPb3BsR0uvj6YpPSJEwp", ne: "https://open.spotify.com/show/67ic9qmrYOxsSaDknnnCLT"};
  var epiP = null;
  function episodes(){
    if (!epiP) epiP = fetch("https://assets.kafka.blog/spotify-episodes.json").then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){ return (j && j.episodes) || {}; }).catch(function(){ return {}; });
    return epiP;
  }
  function spotify(path, lang, cb){ episodes().then(function(m){ cb(m[path] || SHOW[lang === "ne" ? "ne" : "en"]); }); }

  var IC = {
    fs: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.2 10.9l7.6-3.7M8.2 13.1l7.6 3.7"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a8.8 8.8 0 0 0-7.5 13.4L3.3 20.7l4.2-1.1A8.8 8.8 0 1 0 12 3.2z"/><path d="M9.1 8.4c-.3.7-.2 1.8.8 3.2 1.1 1.5 2.4 2.4 3.6 2.8.8.2 1.5-.2 1.7-.9l-1.5-.9-.7.6c-.9-.4-1.8-1.2-2.3-2.2l.6-.7-.8-1.7c-.5-.1-.9 0-1.4-.2z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 21v-7.6h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H8.5v3h2.7V21z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4.5l15 15M19.5 4.5l-15 15"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/></svg>',
    sp: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M7.4 9.8c3.2-1 6.9-.7 9.6.8M8 12.7c2.7-.8 5.5-.5 7.7.7M8.7 15.4c2.1-.6 4.1-.3 5.9.5"/></svg>'
  };


  function esc(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

  function fullscreen(stage, vid){
    var d = document;
    if (d.fullscreenElement || d.webkitFullscreenElement){ (d.exitFullscreen || d.webkitExitFullscreen).call(d); return; }
    if (stage.requestFullscreen) stage.requestFullscreen().catch(function(){ if (vid && vid.webkitEnterFullscreen) vid.webkitEnterFullscreen(); });
    else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
    else if (vid && vid.webkitEnterFullscreen) vid.webkitEnterFullscreen();
  }

  function css(){
    if (document.getElementById("ksh-css")) return;
    var st = document.createElement("style"); st.id = "ksh-css";
    var N = ":not(#ksh1):not(#ksh2)";
    st.textContent = [
      "html body .ksh-ic" + N + "{appearance:none;box-sizing:border-box;border:1px solid rgba(26,26,24,.18);background:rgba(255,255,255,.78);color:#1a1a18;width:26px;height:26px;min-width:26px;border-radius:50%;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0;margin:0;text-decoration:none;flex:0 0 auto;line-height:1}",
      "html body .ksh-ic" + N + ":hover,html body .ksh-ic" + N + ":focus-visible{background:#fff;border-color:rgba(26,26,24,.45)}",
      ".ksh-ic svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;display:block}",
      ".ksh-ic.ksh-fb svg{fill:currentColor;stroke:none}",
      "html body .ksh-ic.ksh-sp" + N + "{background:#1db954;border-color:#1db954;color:#fff}",
      "html body .ksh-ic.ksh-sp" + N + ":hover{background:#17a34a;border-color:#17a34a}",
      ".kpl-film-stage:fullscreen{display:flex;align-items:center;justify-content:center;background:#000}.kpl-film-stage:fullscreen video{width:100%;height:100%;object-fit:contain}",
      ".kpl-film-stage:-webkit-full-screen{display:flex;align-items:center;justify-content:center;background:#000}.kpl-film-stage:-webkit-full-screen video{width:100%;height:100%;object-fit:contain}",
      ".ksh-back{position:fixed;inset:0;z-index:2147483200;background:rgba(24,22,18,.48);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}",
      ".ksh-card{position:relative;width:100%;max-width:360px;background:#fffdf9;color:#1a1a18;border:1px solid #e6dfd3;border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.28);padding:16px 16px 14px;box-sizing:border-box;font-family:var(--sans,Inter,system-ui,sans-serif)}",
      ".ksh-kind{margin:0 28px 8px 0;font:700 11px/1.2 var(--sans,Inter,system-ui,sans-serif);letter-spacing:.06em;text-transform:uppercase;color:#a8665b}",
      ".ksh-top{display:flex;gap:12px;align-items:center;margin:0 0 12px}",
      ".ksh-img{width:58px;height:58px;flex:0 0 58px;border-radius:10px;object-fit:cover;background:#e9e4da}",
      ".ksh-title{margin:0;font:600 16px/1.35 var(--serif,Lora,Georgia,serif);color:#1a1a18;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-align:left}",
      ".ksh-title[lang=ne]{font-family:Martel,var(--serif,serif);font-size:15px;line-height:1.5}",
      ".ksh-sub{margin:3px 0 0;font:500 12px/1.3 var(--sans,Inter,system-ui,sans-serif);color:#6b665e}",
      ".ksh-url{display:flex;gap:6px;align-items:center;margin:0 0 12px}",
      ".ksh-url input{flex:1 1 auto;min-width:0;box-sizing:border-box;border:1px solid #e6dfd3;background:#f7f3ec;color:#5e584f;border-radius:8px;padding:7px 9px;font:12px/1.3 ui-monospace,Menlo,monospace}",
      "html body .ksh-copy" + N + "{appearance:none;border:1px solid rgba(26,26,24,.22);background:#1a1a18;color:#fffdf9;border-radius:999px;padding:7px 12px;font:600 12px/1 var(--sans,Inter,system-ui,sans-serif);cursor:pointer;flex:0 0 auto}",
      ".ksh-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
      ".ksh-row .ksh-ic{width:36px;height:36px;min-width:36px}.ksh-row .ksh-ic svg{width:18px;height:18px}",
      ".ksh-toast:empty{display:none}.ksh-toast{display:block;margin-top:8px;font:500 12px/1.2 var(--sans,Inter,system-ui,sans-serif);color:#2b6b3a}",
      "html body .ksh-close" + N + "{position:absolute;top:8px;right:8px;width:28px;height:28px;border:0;background:transparent;color:#6b665e;font-size:22px;line-height:1;cursor:pointer;padding:0}",
      "@media (max-width:520px){.ksh-back{align-items:flex-end;padding:0}.ksh-card{max-width:none;border-radius:18px 18px 0 0;padding-bottom:18px}}"
    ].join("");
    document.head.appendChild(st);
  }

  var openBack = null, lastFocus = null;
  function close(){
    if (!openBack) return;
    document.removeEventListener("keydown", onKey, true);
    if (openBack.parentNode) openBack.parentNode.removeChild(openBack);
    openBack = null;
    if (lastFocus && lastFocus.focus){ try { lastFocus.focus(); } catch(e){} }
  }
  function onKey(ev){ if (ev.key === "Escape"){ ev.stopPropagation(); close(); } }

  /* opts: title, url (the post's address, with a #kfilm or #klisten anchor if wanted), text (message), img, kind, lang, spotify */
  function open(o){
    css(); close();
    lastFocus = document.activeElement;
    var ne = o.lang === "ne";
    var L = ne
      ? {kind: o.kind || "सेयर गर्नुहोस्", copy: "कपी", copied: "लिङ्क कपी भयो", share: "सेयर", wa: "WhatsApp", fb: "Facebook", x: "X", link: "लिङ्क कपी गर्नुहोस्", sp: "Spotify मा सुन्नुहोस्", close: "बन्द गर्नुहोस्", sub: "बासभ · Kafkaintherun"}
      : {kind: o.kind || "Share", copy: "Copy", copied: "Link copied", share: "Share", wa: "WhatsApp", fb: "Facebook", x: "X", link: "Copy link", sp: "Listen on Spotify", close: "Close", sub: "Basava · Kafkaintherun"};
    var url = o.url, text = o.text || o.title;
    var eu = encodeURIComponent(url), et = encodeURIComponent(text);
    function ic(cls, label, inner, href){
      return href
        ? '<a class="ksh-ic ' + cls + '" target="_blank" rel="noopener" href="' + href + '" aria-label="' + esc(label) + '" title="' + esc(label) + '">' + inner + '</a>'
        : '<button type="button" class="ksh-ic ' + cls + '" aria-label="' + esc(label) + '" title="' + esc(label) + '">' + inner + '</button>';
    }
    var back = document.createElement("div"); back.className = "ksh-back";
    back.innerHTML =
      '<div class="ksh-card" role="dialog" aria-modal="true" aria-label="' + esc(L.kind) + '">' +
        '<button type="button" class="ksh-close" aria-label="' + esc(L.close) + '">&times;</button>' +
        '<p class="ksh-kind">' + esc(L.kind) + '</p>' +
        '<div class="ksh-top">' + (o.img ? '<img class="ksh-img" alt="" src="' + esc(o.img) + '"/>' : '') +
          '<div><p class="ksh-title" lang="' + esc(o.lang || "en") + '">' + esc(o.title) + '</p><p class="ksh-sub">' + esc(L.sub) + '</p></div></div>' +
        '<div class="ksh-url"><input type="text" readonly value="' + esc(url) + '" aria-label="Link"/><button type="button" class="ksh-copy">' + esc(L.copy) + '</button></div>' +
        '<div class="ksh-row">' +
          (navigator.share ? ic("ksh-native", L.share, IC.share) : '') +
          ic("ksh-wa", L.wa, IC.wa, "https://wa.me/?text=" + et + "%20" + eu) +
          ic("ksh-fb", L.fb, IC.fb, "https://www.facebook.com/sharer/sharer.php?u=" + eu + "&quote=" + et) +
          ic("ksh-x", L.x, IC.x, "https://x.com/intent/post?url=" + eu + "&text=" + et) +
          ic("ksh-link", L.link, IC.link) +
          (o.spotify ? ic("ksh-sp", L.sp, IC.sp, esc(o.spotify)) : '') +
        '</div>' +
        '<span class="ksh-toast" role="status" aria-live="polite"></span>' +
      '</div>';
    document.body.appendChild(back); openBack = back;
    var toast = back.querySelector(".ksh-toast"), inp = back.querySelector("input");
    function copied(){ toast.textContent = L.copied; }
    function copy(){
      var full = text + " " + url;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(full).then(copied, function(){ inp.select(); });
      else { inp.select(); try { document.execCommand("copy"); copied(); } catch(e){} }
    }
    back.querySelector(".ksh-copy").addEventListener("click", copy);
    back.querySelector(".ksh-link").addEventListener("click", copy);
    var nat = back.querySelector(".ksh-native");
    if (nat) nat.addEventListener("click", function(){ navigator.share({title: o.title, text: text, url: url}).catch(function(){}); });
    back.querySelector(".ksh-close").addEventListener("click", close);
    back.addEventListener("click", function(ev){ if (ev.target === back) close(); });
    document.addEventListener("keydown", onKey, true);
    var first = back.querySelector(".ksh-copy"); if (first) first.focus();
  }

  css();
  window.KShare = {open: open, close: close, spotify: spotify, fullscreen: fullscreen, icon: function(n){ return IC[n] || ""; }, SHOW: SHOW};
})();

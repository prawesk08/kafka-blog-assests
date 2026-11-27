/* Adds schema.org AudioObject JSON-LD for a post's narration, from audio.kafka.blog/manifest.json. */
(function(){
  try{
    var p=location.pathname;
    if(!/^\/\d{4}\/\d{2}\/.+\.html$/.test(p))return;
    if(document.getElementById("kaudio-schema"))return; /* v5: the build already wrote it into the page */
    fetch("https://audio.kafka.blog/manifest.json").then(function(r){return r.ok?r.json():null}).then(function(m){
      var e=m&&m[p];if(!e)return;
      function iso(s){s=Math.round(s);var h=Math.floor(s/3600),mi=Math.floor(s%3600/60),se=s%60;
        return"PT"+(h?h+"H":"")+(mi?mi+"M":"")+(se||!(h||mi)?se+"S":"")}
      var title=document.title.replace(/\s*\|[^|]*$/,"").trim();
      var url=location.origin+p,lang=e.l==="ne"?"ne":"en",out=[];
      [["f","sf","female"],["m","sm","male"]].forEach(function(k){
        if(!e[k[0]]||!e[k[1]])return;
        out.push({"@type":"AudioObject","name":title+" (audio, "+k[2]+" voice)",
          "contentUrl":"https://audio.kafka.blog/"+e[k[0]],"encodingFormat":"audio/mpeg",
          "duration":iso(e[k[1]]),"inLanguage":lang,"isPartOf":{"@type":"BlogPosting","@id":url+"#post","url":url}});
      });
      if(!out.length)return;
      var s=document.createElement("script");s.type="application/ld+json";s.id="kaudio-schema";
      s.text=JSON.stringify({"@context":"https://schema.org","@graph":out});
      document.head.appendChild(s);
    }).catch(function(){});
  }catch(x){}
})();

/* Note: the theme renders .klisten at zoom .7, so sizes inside it are 1/0.7 of the on-screen size. */
/* Podcast subscribe menu: footer "Podcast" link (every page) and a small button in the post's Listen panel. */
(function(){
  try{
    /* Add platform links here once each show is live, e.g. ["Apple Podcasts","https://podcasts.apple.com/..."] */
    var SHOWS=[
      {lang:"en",name:"English",feed:"https://audio.kafka.blog/podcast-en.xml",links:[]},
      {lang:"ne",name:"नेपाली",feed:"https://audio.kafka.blog/podcast-ne.xml",links:[]}
    ];
    var css=".kpod-btn{background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;margin-left:16px}"+
      ".kpod-btn:hover{text-decoration:underline}"+
      ".kpod-pop{position:fixed;z-index:2147483000;min-width:230px;max-width:300px;background:#fffdf9;color:#191918;border:1px solid #e6dfd3;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:12px 14px;font:14px/1.4 Inter,system-ui,sans-serif}"+
      ".kpod-pop h4{margin:0 0 8px;font:600 13px/1.3 Inter,system-ui,sans-serif;color:#7b2d26;letter-spacing:.02em}"+
      ".kpod-show{margin:8px 0 0}.kpod-show b{display:block;font-weight:600;margin-bottom:2px}"+
      ".kpod-show a{display:block;color:#5e584f;text-decoration:none;padding:3px 0}.kpod-show a:hover{color:#7b2d26}"+
      ".kpod-note{margin:10px 0 0;font-size:12px;color:#8a8378}"+
      ".kpod-url{display:block;width:100%;box-sizing:border-box;margin:4px 0 2px;padding:4px 6px;border:1px solid #e6dfd3;border-radius:6px;background:#f7f3ec;color:#5e584f;font:12px/1.3 ui-monospace,Menlo,monospace}"+
      "html body .klisten.top-of-post:not(#kp1):not(#kp2):not(#kp3):not(#kp4):not(#kp5):not(#kp6):not(#kp7):not(#kp8):not(#kp9):not(#kp10):not(#kp11):not(#kp12) .kl-label{font-size:19px!important;line-height:1.15!important;align-self:end}"+
      "html body .klisten.top-of-post:not(#kp1):not(#kp2):not(#kp3):not(#kp4):not(#kp5):not(#kp6):not(#kp7):not(#kp8):not(#kp9):not(#kp10):not(#kp11):not(#kp12) .kl-mid .kl-time{font-size:17px!important;line-height:1.15!important;font-variant-numeric:tabular-nums;align-self:end}"+
      "html body .klisten.top-of-post:not(#kp1):not(#kp2):not(#kp3):not(#kp4):not(#kp5):not(#kp6):not(#kp7):not(#kp8):not(#kp9):not(#kp10):not(#kp11):not(#kp12) .kl-mid{row-gap:4px}"+
      /* one line: Listen panel 75% | Follow block 25% (two stacked rows). The theme dock swaps the panel for a .kl-ph placeholder, which keeps the 75%. */
      "html body .klrow:not(#kr1):not(#kr2):not(#kr3):not(#kr4):not(#kr5):not(#kr6):not(#kr7):not(#kr8):not(#kr9):not(#kr10):not(#kr11):not(#kr12){display:flex;align-items:stretch;gap:8px;margin:16px 0 0;width:100%}"+
      "html body .klrow:not(#kr1):not(#kr2):not(#kr3):not(#kr4):not(#kr5):not(#kr6):not(#kr7):not(#kr8):not(#kr9):not(#kr10):not(#kr11):not(#kr12) > .klisten,html body .klrow:not(#kr1):not(#kr2):not(#kr3):not(#kr4):not(#kr5):not(#kr6):not(#kr7):not(#kr8):not(#kr9):not(#kr10):not(#kr11):not(#kr12) > .kl-ph{flex:0 0 calc(75% - 6px)!important;width:auto!important;max-width:none!important;min-width:0!important;margin:0!important;box-sizing:border-box}"+
      ".kfollow{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:3px;padding:3px 10px;box-sizing:border-box;border:1px solid rgba(25,25,24,.14);border-radius:18px;opacity:.6;transition:opacity .2s}"+
      ".kfollow:hover,.kfollow:focus-within{opacity:1}"+
      ".kfollow .kf-top{display:flex;align-items:center;gap:6px;min-width:0;white-space:nowrap;overflow:hidden}"+
      ".kfollow .kf-lbl{flex:none;font:700 calc(var(--kff,9px) + 1.5px)/1.15 system-ui,sans-serif;letter-spacing:0;color:#fff;background:#7b2d26;padding:1px 8px 2px;border-radius:999px}"+
      ".kfollow .kf-lbl span{text-transform:none;letter-spacing:0}"+
      ".kfollow .kf-h{min-width:0;overflow:hidden;text-overflow:ellipsis;font:500 var(--kff,9px)/1 Inter,system-ui,sans-serif;color:#5e584f;text-decoration:none}.kfollow .kf-h:hover{color:#7b2d26}"+
      ".kfollow .kf-ics{display:flex;align-items:center;justify-content:space-between;gap:3px;min-width:0}"+
      ".kfollow .kf-ics a,.kfollow .kf-ics button{display:inline-flex;align-items:center;justify-content:center;flex:0 1 auto;width:var(--kfw,20px);height:var(--kfh,16px);border-radius:var(--kfr,6px);border:0;padding:0;margin:0;cursor:pointer;color:#fff;text-decoration:none}"+
      ".kfollow .kf-ics svg{width:calc(var(--kfh,16px)*.68);height:calc(var(--kfh,16px)*.68);display:block}"+
      ".kf-ap{background:linear-gradient(180deg,#d56dfb,#872ec4)}.kf-sp{background:#1db954}.kf-rss{background:#f08a24}"+
      ".kf-x{background:#191918}.kf-ig{background:linear-gradient(45deg,#f9a03f,#e1306c 50%,#833ab4)}.kf-tt{background:#191918}"+
      "@media (max-width:640px){html body .klrow:not(#kr1):not(#kr2):not(#kr3):not(#kr4):not(#kr5):not(#kr6):not(#kr7):not(#kr8):not(#kr9):not(#kr10):not(#kr11):not(#kr12){gap:6px;flex-wrap:nowrap!important}html body .klrow:not(#kr1):not(#kr2):not(#kr3):not(#kr4):not(#kr5):not(#kr6):not(#kr7):not(#kr8):not(#kr9):not(#kr10):not(#kr11):not(#kr12) > .klisten,html body .klrow:not(#kr1):not(#kr2):not(#kr3):not(#kr4):not(#kr5):not(#kr6):not(#kr7):not(#kr8):not(#kr9):not(#kr10):not(#kr11):not(#kr12) > .kl-ph{flex:0 0 calc(64% - 4px)!important}.kfollow{flex:1 1 auto!important;flex-basis:auto!important;flex-direction:column!important;align-items:stretch!important;padding:2px 7px;border-radius:14px}.kfollow .kf-top{justify-content:flex-start}.kfollow .kf-ics{justify-content:space-between}.kfollow .kf-top{gap:4px}.kfollow .kf-lbl{padding:1px 6px 2px}.kfollow .kf-ics{gap:2px}}"+
      /* sidebar bio card: centre the cubist face of the header art (face sits ~67% across the 16:9 art) */
      "html body .box.sbio:not(#kb1):not(#kb2):not(#kb3):not(#kb4):not(#kb5):not(#kb6):not(#kb7):not(#kb8):not(#kb9):not(#kb10):not(#kb11):not(#kb12){background-position:0 0,76% 30%!important}"+
      /* tighter paragraph rhythm: text-to-text gap ~18px (was ~48px: 16px padding top+bottom plus 16px margin) */
      "html body .prose:not(#kq1):not(#kq2):not(#kq3):not(#kq4):not(#kq5):not(#kq6):not(#kq7):not(#kq8):not(#kq9):not(#kq10):not(#kq11):not(#kq12) > p{padding-top:3px!important;padding-bottom:3px!important;margin-bottom:12px!important}"+
      "html body .prose:not(#kq1):not(#kq2):not(#kq3):not(#kq4):not(#kq5):not(#kq6):not(#kq7):not(#kq8):not(#kq9):not(#kq10):not(#kq11):not(#kq12) .kshort-drop{margin-top:12px!important;margin-bottom:12px!important}";
    var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
    function L(){return (document.documentElement.lang||"").indexOf("ne")===0}
    var pop=null;
    function close(){if(pop){pop.remove();pop=null;document.removeEventListener("click",outside,true);document.removeEventListener("keydown",esc)}}
    function outside(e){if(pop&&!pop.contains(e.target)&&!e.target.closest(".kpod-btn,.kpod-ic"))close()}
    function esc(e){if(e.key==="Escape")close()}
    function open(anchor,first){
      if(pop){close();return}
      pop=document.createElement("div");pop.className="kpod-pop";pop.setAttribute("role","dialog");
      pop.setAttribute("aria-label","Podcast");
      var h=document.createElement("h4");h.textContent=L()?"पोडकास्टमा सुन्नुहोस्":"Listen as a podcast";pop.appendChild(h);
      var list=SHOWS.slice().sort(function(a,b){return (b.lang===first)-(a.lang===first)});
      list.forEach(function(s){
        var d=document.createElement("div");d.className="kpod-show";
        var b=document.createElement("b");b.textContent=s.name;if(s.lang==="ne")b.lang="ne";d.appendChild(b);
        var T=L()?{ap:"Apple Podcasts मा सदस्यता",cp:"फिड लिंक कपी",op:"फिड खोल्नुहोस्",ok:"कपी भयो ✓",sel:"लिंक छानियो - कपी गर्नुहोस्"}:{ap:"Subscribe in Apple Podcasts",cp:"Copy feed link",op:"Open feed",ok:"Copied ✓",sel:"Link selected - press Ctrl/⌘+C"};
        function item(txt,href,blank){var a=document.createElement("a");a.href=href;a.textContent=txt;if(blank){a.target="_blank";a.rel="noopener"}d.appendChild(a);return a}
        s.links.forEach(function(l){item(l[0],l[1],1)});
        item(T.ap,s.feed.replace(/^https:/,"podcast:"));
        var cp=item(T.cp,s.feed);
        cp.addEventListener("click",function(e){
          if(e.metaKey||e.ctrlKey)return;e.preventDefault();
          var show=function(t){cp.textContent=t;setTimeout(function(){cp.textContent=T.cp},2200)};
          var legacy=function(){u.focus();u.select();var ok=false;try{ok=document.execCommand("copy")}catch(x){}show(ok?T.ok:T.sel)};
          if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(s.feed).then(function(){show(T.ok)},legacy);else legacy();
        });
        item(T.op,s.feed,1);
        var u=document.createElement("input");u.className="kpod-url";u.readOnly=true;u.value=s.feed;
        u.addEventListener("focus",function(){u.select()});d.appendChild(u);
        pop.appendChild(d);
      });
      var n=document.createElement("p");n.className="kpod-note";
      n.textContent=L()?"अर्को एप? फिड लिंक कपी गरेर त्यहाँ \"Add by URL\" मा टाँस्नुहोस्।":"Other app? Copy the feed link and paste it under \"Add by URL\".";pop.appendChild(n);
      document.body.appendChild(pop);
      var r=anchor.getBoundingClientRect(),w=pop.offsetWidth,hh=pop.offsetHeight;
      var x=Math.min(Math.max(8,r.right-w),innerWidth-w-8),y=r.top-hh-8;if(y<8)y=r.bottom+8;
      pop.style.left=x+"px";pop.style.top=y+"px";
      setTimeout(function(){document.addEventListener("click",outside,true);document.addEventListener("keydown",esc)},0);
    }
    addEventListener("scroll",close,{passive:true});
    function footer(){
      var rss=document.querySelector(".foot-line a.rss-link");
      if(!rss||document.querySelector(".kpod-btn"))return !!rss;
      var b=document.createElement("button");b.type="button";b.className="kpod-btn";
      b.textContent=L()?"पोडकास्ट":"Podcast";b.setAttribute("aria-haspopup","dialog");
      b.addEventListener("click",function(){open(b,L()?"ne":"en")});
      rss.parentNode.insertBefore(b,rss.nextSibling);return true;
    }
    var I={
      x:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
      ig:'<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>',
      tt:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.6 3c.4 2.4 1.8 3.9 4.1 4.1v3.1c-1.5 0-2.9-.5-4.1-1.3v6.4a6.2 6.2 0 1 1-6.2-6.2c.3 0 .6 0 .9.1v3.2a3.1 3.1 0 1 0 2.2 3V3z"/></svg>',
      ap:'<svg viewBox="0 0 24 24"><circle cx="12" cy="10.5" r="2.3" fill="currentColor"/><path d="M8.4 14.6a5.2 5.2 0 1 1 7.2 0M5.7 17.3a9 9 0 1 1 12.6 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M12 14.2v6.3" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
      sp:'<svg viewBox="0 0 24 24"><path d="M5.5 9.2c4.5-1.4 9.4-1 13.2 1.1M6.3 12.7c3.7-1.1 7.6-.7 10.8.9M7.2 15.9c2.9-.8 5.8-.5 8.3.7" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg>',
      rss:'<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.2" fill="currentColor"/><path d="M4 11a9 9 0 0 1 9 9M4 4.5A15.5 15.5 0 0 1 19.5 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
    };
    /* Follow links. Apple: show page goes live after review. Spotify: search until the show link is known. */
    var FOLLOW=[
      ["x","X","https://x.com/naharchowck"],
      ["ig","Instagram","https://www.instagram.com/naharchowck/"],
      ["tt","TikTok","https://www.tiktok.com/@naharchowck"],
      ["ap","Apple Podcasts","https://podcasts.apple.com/us/podcast/kafkaintherun/id6839536736"],
      ["sp","Spotify","https://open.spotify.com/show/43tPb3BsR0uvj6YpPSJEwp"]
    ];
    function listen(){
      var li=document.querySelector(".post-head .klisten.top-of-post")||document.querySelector(".post-head .kl-ph");
      if(document.querySelector(".kfollow"))return true;if(!li)return false;
      var row=document.createElement("div");row.className="klrow";
      /* the theme orders .post-head children with CSS order; read the Listen panel's order from a stand-in (the real panel may already be in the dock) */
      var pr=document.createElement("div");pr.className="klisten top-of-post";pr.style.cssText="position:absolute;visibility:hidden;height:0;overflow:hidden";
      li.parentNode.insertBefore(pr,li);var od=getComputedStyle(pr).order;pr.remove();
      li.parentNode.insertBefore(row,li);row.appendChild(li);row.style.order=od;
      var box=document.createElement("div");box.className="kfollow";box.setAttribute("role","group");box.setAttribute("aria-label","Follow बासभ @naharchowck");
      var top=document.createElement("div");top.className="kf-top";
      var lb=document.createElement("span");lb.className="kf-lbl";lb.lang="ne";lb.textContent="बासभ";top.appendChild(lb);
      var h=document.createElement("a");h.className="kf-h";h.href="https://x.com/naharchowck";h.target="_blank";h.rel="noopener";h.textContent="@naharchowck";top.appendChild(h);
      box.appendChild(top);
      var g=document.createElement("div");g.className="kf-ics";
      FOLLOW.forEach(function(f){
        var a=document.createElement("a");a.className="kf-"+f[0];a.href=f[2];a.target="_blank";a.rel="noopener";
        a.setAttribute("aria-label",f[1]);a.title=f[1];a.innerHTML=I[f[0]];g.appendChild(a);
      });
      var b=document.createElement("button");b.type="button";b.className="kf-rss kpod-ic";b.innerHTML=I.rss;
      b.setAttribute("aria-label","Podcast RSS");b.title=L()?"पोडकास्ट RSS फिड":"Podcast RSS feed";
      b.addEventListener("click",function(e){e.stopPropagation();open(b,L()?"ne":"en")});
      g.appendChild(b);box.appendChild(g);row.appendChild(box);
      /* size the two rows from the block's own height, so it matches the Listen panel's thickness */
      function fit(){
        var r=box.getBoundingClientRect();if(!r.height)return;
        var inner=box.clientHeight-6,hh=Math.max(10,Math.min(22,(inner-3)/2));
        var n=g.children.length,avail=g.clientWidth,ww=Math.min(hh*1.3,(avail-(n-1)*2)/n);hh=Math.min(hh,ww);
        box.style.setProperty("--kfh",hh+"px");box.style.setProperty("--kfw",Math.max(ww,hh)+"px");box.style.setProperty("--kfr",(hh*.35)+"px");box.style.setProperty("--kff",Math.max(8,Math.min(11,hh*.6))+"px");
      }
      fit();setTimeout(fit,1500);
      if(window.ResizeObserver)new ResizeObserver(function(){fit()}).observe(box);else window.addEventListener("resize",fit);
      return true;
    }
    var n=0,t=setInterval(function(){n++;var f=footer(),l=listen();if((f&&l)||n>40)clearInterval(t)},250);
  }catch(x){}
})();

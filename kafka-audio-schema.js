/* Adds schema.org AudioObject JSON-LD for a post's narration, from audio.kafka.blog/manifest.json. */
(function(){
  try{
    var p=location.pathname;
    if(!/^\/\d{4}\/\d{2}\/.+\.html$/.test(p))return;
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
      var s=document.createElement("script");s.type="application/ld+json";
      s.text=JSON.stringify({"@context":"https://schema.org","@graph":out});
      document.head.appendChild(s);
    }).catch(function(){});
  }catch(x){}
})();

/* Podcast subscribe menu: footer "Podcast" link (every page) and a small button in the post's Listen panel. */
(function(){
  try{
    /* Add platform links here once each show is live, e.g. ["Apple Podcasts","https://podcasts.apple.com/..."] */
    var SHOWS=[
      {lang:"en",name:"English",links:[["RSS feed","https://audio.kafka.blog/podcast-en.xml",1]]},
      {lang:"ne",name:"नेपाली",links:[["RSS feed","https://audio.kafka.blog/podcast-ne.xml",1]]}
    ];
    var css=".kpod-btn{background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;margin-left:16px}"+
      ".kpod-btn:hover{text-decoration:underline}"+
      ".kpod-pop{position:fixed;z-index:2147483000;min-width:230px;max-width:300px;background:#fffdf9;color:#191918;border:1px solid #e6dfd3;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:12px 14px;font:14px/1.4 Inter,system-ui,sans-serif}"+
      ".kpod-pop h4{margin:0 0 8px;font:600 13px/1.3 Inter,system-ui,sans-serif;color:#7b2d26;letter-spacing:.02em}"+
      ".kpod-show{margin:8px 0 0}.kpod-show b{display:block;font-weight:600;margin-bottom:2px}"+
      ".kpod-show a{display:block;color:#5e584f;text-decoration:none;padding:3px 0}.kpod-show a:hover{color:#7b2d26}"+
      ".kpod-note{margin:10px 0 0;font-size:12px;color:#8a8378}"+
      "html body .klisten.top-of-post .kl-label{font-size:15px!important;line-height:1.15!important;align-self:end}"+
      "html body .klisten.top-of-post .kl-time{font-size:13px!important;line-height:1.15!important;font-variant-numeric:tabular-nums;align-self:end}"+
      "html body .klisten.top-of-post .kl-mid{row-gap:4px}"+
      ".kfol{display:flex;align-items:center;gap:6px;margin-left:10px;padding-left:10px;border-left:1px solid rgba(25,25,24,.14);flex:none}"+
      ".kfol a,.kfol button{display:inline-flex;align-items:center;justify-content:center;width:30px;height:24px;border-radius:10px;border:0;padding:0;cursor:pointer;color:#fff;text-decoration:none;opacity:.9}"+
      ".kfol a:hover,.kfol button:hover{opacity:1}"+
      ".kfol svg{width:15px;height:15px}"+
      ".kf-x{background:#191918}.kf-ig{background:linear-gradient(45deg,#f9a03f,#e1306c 50%,#833ab4)}.kf-tt{background:#191918}"+
      ".kf-ap{background:linear-gradient(180deg,#d56dfb,#872ec4)}.kf-sp{background:#1db954}.kf-rss{background:#f08a24}"+
      "@media (max-width:640px){html body .klisten.top-of-post{flex-wrap:wrap!important;border-radius:22px!important;row-gap:8px}"+
      ".kfol{order:9;flex-basis:100%;justify-content:center;margin:0;padding:8px 0 2px;border-left:0;border-top:1px solid rgba(25,25,24,.1)}}";
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
        s.links.forEach(function(l){
          var a=document.createElement("a");a.href=l[1];a.textContent=l[0];
          if(l[2]){a.title="Copy the feed link";a.addEventListener("click",function(e){
            if(e.metaKey||e.ctrlKey||!navigator.clipboard)return;e.preventDefault();
            navigator.clipboard.writeText(l[1]).then(function(){var t=a.textContent;a.textContent=L()?"लिंक कपी भयो":"Link copied";setTimeout(function(){a.textContent=t},1800)},function(){location.href=l[1]});
          })}else{a.target="_blank";a.rel="noopener"}
          d.appendChild(a);
        });
        pop.appendChild(d);
      });
      var n=document.createElement("p");n.className="kpod-note";
      n.textContent=L()?"फिड लिंक कपी गरेर आफ्नो पोडकास्ट एपमा टाँस्नुहोस्।":"Copy a feed link and paste it into your podcast app.";pop.appendChild(n);
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
      ["sp","Spotify","https://open.spotify.com/search/Kafkaintherun/podcasts"]
    ];
    function listen(){
      var panel=document.querySelector(".klisten.top-of-post");
      if(!panel)return false;if(panel.querySelector(".kfol"))return true;
      var g=document.createElement("span");g.className="kfol";g.setAttribute("role","group");g.setAttribute("aria-label",L()?"फलो गर्नुहोस्":"Follow");
      FOLLOW.forEach(function(f){
        var a=document.createElement("a");a.className="kf-"+f[0];a.href=f[2];a.target="_blank";a.rel="noopener";
        a.setAttribute("aria-label",f[1]);a.title=f[1];a.innerHTML=I[f[0]];g.appendChild(a);
      });
      var b=document.createElement("button");b.type="button";b.className="kf-rss kpod-ic";b.innerHTML=I.rss;
      b.setAttribute("aria-label",L()?"पोडकास्ट RSS":"Podcast RSS");b.title=b.getAttribute("aria-label");
      b.addEventListener("click",function(e){e.stopPropagation();open(b,L()?"ne":"en")});
      g.appendChild(b);panel.appendChild(g);return true;
    }
    var n=0,t=setInterval(function(){n++;var f=footer(),l=listen();if((f&&l)||n>40)clearInterval(t)},250);
  }catch(x){}
})();

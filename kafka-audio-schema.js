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
      ".kpod-ic{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;border:0;background:#fff;color:#7b2d26;cursor:pointer;padding:0;flex:none}"+
      ".kpod-ic svg{width:15px;height:15px}"+
      ".kpod-pop{position:fixed;z-index:2147483000;min-width:230px;max-width:300px;background:#fffdf9;color:#191918;border:1px solid #e6dfd3;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:12px 14px;font:14px/1.4 Inter,system-ui,sans-serif}"+
      ".kpod-pop h4{margin:0 0 8px;font:600 13px/1.3 Inter,system-ui,sans-serif;color:#7b2d26;letter-spacing:.02em}"+
      ".kpod-show{margin:8px 0 0}.kpod-show b{display:block;font-weight:600;margin-bottom:2px}"+
      ".kpod-show a{display:block;color:#5e584f;text-decoration:none;padding:3px 0}.kpod-show a:hover{color:#7b2d26}"+
      ".kpod-note{margin:10px 0 0;font-size:12px;color:#8a8378}";
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
    var ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="11" r="2.2" fill="currentColor"/><path d="M8.2 14.8a5.4 5.4 0 1 1 7.6 0M5.4 17.6a9.4 9.4 0 1 1 13.2 0M12 14v7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    function listen(){
      var right=document.querySelector(".klisten.top-of-post .kl-right");
      if(!right)return false;if(right.querySelector(".kpod-ic"))return true;
      var b=document.createElement("button");b.type="button";b.className="kpod-ic";b.innerHTML=ICON;
      b.setAttribute("aria-label",L()?"पोडकास्टमा सदस्यता लिनुहोस्":"Subscribe to the podcast");b.title=b.getAttribute("aria-label");
      b.addEventListener("click",function(e){e.stopPropagation();open(b,L()?"ne":"en")});
      right.appendChild(b);return true;
    }
    var n=0,t=setInterval(function(){n++;var f=footer(),l=listen();if((f&&l)||n>40)clearInterval(t)},250);
  }catch(x){}
})();

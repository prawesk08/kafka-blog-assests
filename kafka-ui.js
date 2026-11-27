/* v7: the tinted canvases are blurred 10-38px, so they only need a tiny copy of the photo.
   Using the full-size photo there cost ~7.7 MB on the homepage (PageSpeed, 2026-11-27). */
window.kTiny=window.kTiny||function(u,n){
  if(!u||/^data:/.test(u))return u;n=n||96;var W='=w'+n+'-rw';
  if(/googleusercontent\.com|blogspot\.com|ggpht\.com/.test(u)){
    if(/\/d\/[^\/=?]+(=[^\/?]*)?$/.test(u))return u.replace(/(\/d\/[^\/=?]+)(=[^\/?]*)?$/,'$1'+W);
    if(/\/(s|w)\d+[^\/]*\/[^\/]+$/.test(u))return u.replace(/\/(s|w)\d+[^\/]*\/([^\/]+)$/,'/w'+n+'/$2');
    if(/=[swh]\d+[^\/?]*$/.test(u))return u.replace(/=[swh]\d+[^\/?]*$/,W);
    return u+W;
  }
  return u;
};
(function(){
  var CHEV='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
  function artUrl(key,w){
    var el=document.querySelector('img[data-art]');
    if(el&&el.src&&window.KAFKA_ART&&window.KAFKA_ART[key]){
      return el.src.replace(/\/d\/[^=]+(=w\d+)?/,'/d/'+window.KAFKA_ART[key]+'=w'+(w||120));
    }
    var fav=document.querySelector('link[rel~="icon"]');
    return fav&&fav.href?fav.href:'';
  }
  function makeSummaryHTML(title,kicker,pill,logoUrl){
    var img=logoUrl?'<img class="kd-logo" alt="" src="'+logoUrl+'"/>':'';
    return '<span class="kd-lhs">'+img+'<span class="kd-title-wrap"><span class="kd-kicker">'+kicker+'</span><span class="kd-title">'+title+'</span></span></span>'
      +'<span class="kd-rhs"><span class="kd-pill">'+pill+'</span><span class="kd-chev" aria-hidden="true">'+CHEV+'</span></span>';
  }
  function normT(s){return String(s||'').replace(/[\s\u00a0]+/g,' ').trim()}
  /* v180: one card for every kind of piece — poems, letters, stories, essays — authored line or automatic */
  var KMORE={
    poems:{en:'More poems by Basava',ne:'बासभका अरू कविता',allEn:'All poems',allNe:'सबै कविता',label:'Poetry'},
    letters:{en:'More letters by Basava',ne:'बासभका अरू चिठी',allEn:'All letters',allNe:'सबै चिठी',label:'Letters'},
    stories:{en:'More stories by Basava',ne:'बासभका अरू कथा',allEn:'All stories',allNe:'सबै कथा',label:'Stories'},
    essays:{en:'More essays by Basava',ne:'बासभका अरू लेख',allEn:'All essays',allNe:'सबै लेख',label:'Articles'}
  };
  function kmoreKind(txt){
    var t=String(txt||'').toLowerCase();
    if(/letter|चिठी|पत्र/.test(t))return 'letters';
    if(/stor|कथा/.test(t))return 'stories';
    if(/essay|article|piece|लेख|निबन्ध/.test(t))return 'essays';
    return 'poems';
  }
  function kmoreCard(kind,isNe,items,allLink,logoUrl){
    var K=KMORE[kind]||KMORE.poems;
    var card=document.createElement('section');card.className='kmore-poems kmore-'+kind;
    if(isNe)card.setAttribute('lang','ne');
    var head=document.createElement('div');head.className='kmore-head';
    var kick=document.createElement('span');kick.className='kmore-kicker';
    if(logoUrl){var li=document.createElement('img');li.className='kd-logo';li.alt='';li.src=logoUrl;li.width=22;li.height=22;kick.appendChild(li);}
    var kt=document.createElement('span');kt.textContent=isNe?K.ne:K.en;kick.appendChild(kt);
    head.appendChild(kick);
    if(allLink&&allLink.href){
      var al=document.createElement('a');al.className='kmore-all';al.href=allLink.href;
      al.textContent=(allLink.text||(isNe?K.allNe:K.allEn)).replace(/[›>]\s*$/,'').trim()+' ›';
      head.appendChild(al);
    }
    card.appendChild(head);
    var grid=document.createElement('div');grid.className='kmore-grid';
    items.forEach(function(it){
      var a=document.createElement('a');a.className='kmore-link';a.href=it.href;
      var sp=document.createElement('span');sp.textContent=it.text;
      if(/[ऀ-ॿ]/.test(it.text))sp.setAttribute('lang','ne');
      var ar=document.createElement('span');ar.className='kmore-arr';ar.setAttribute('aria-hidden','true');ar.textContent='→';
      a.appendChild(sp);a.appendChild(ar);grid.appendChild(a);
    });
    card.appendChild(grid);
    return card;
  }
  function placeKmore(prose,card){
    var row=prose.querySelector('.poem-row');
    var end=prose.querySelector(':scope > .end-doodle');
    if(row&&row.parentNode){row.parentNode.insertBefore(card,row.nextSibling)}
    else if(end){prose.insertBefore(card,end)}
    else{prose.appendChild(card)}
  }
  function upgradeMorePoems(prose,logoUrl){
    if(!prose||document.querySelector('.kmore-poems'))return;
    var reMP=/^(?:More\s+(?:poems|letters|stories|essays|articles|pieces)(?:\s+by\s+Basava)?|(?:Related|Other)\s+(?:poems|letters|stories|essays)|(?:बासभका\s+)?(?:अरू|अरु|थप|अन्य|सम्बन्धित)\s+(?:कविता|चिठी|पत्र|कथा|निबन्ध|लेख)(?:हरू|हरु)?)/i;
    var reAll=/^(all\s+(poems|letters|stories|essays|articles|pieces)|सबै\s+)/i;
    var ps=Array.prototype.slice.call(prose.querySelectorAll('p, div, h2, h3, h4'));
    for(var i=ps.length-1;i>=0;i--){
      var el=ps[i];
      if(el.querySelector('p, div'))continue;
      var txt=normT(el.textContent);
      var mm=txt.match(reMP);
      if(!mm)continue;
      var links=Array.prototype.slice.call(el.querySelectorAll('a[href]'));
      var extraList=null;
      if(!links.length){
        var nx=el.nextElementSibling;
        while(nx&&!normT(nx.textContent)&&!nx.querySelector('a[href]'))nx=nx.nextElementSibling;
        if(nx&&(nx.tagName==='UL'||nx.tagName==='OL')){
          extraList=nx;
          links=Array.prototype.slice.call(nx.querySelectorAll('a[href]'));
        }
      }
      if(!links.length)continue;
      var allLink=null,items=[];
      links.forEach(function(a){
        var t=normT(a.textContent);
        if(reAll.test(t)){allLink={href:a.getAttribute('href'),text:t}}
        else if(t){items.push({href:a.getAttribute('href'),text:t})}
      });
      if(!items.length)continue;
      var card=kmoreCard(kmoreKind(mm[0]),/[ऀ-ॿ]/.test(mm[0]),items,allLink,logoUrl);
      if(el.parentNode)el.parentNode.removeChild(el);
      if(extraList&&extraList.parentNode)extraList.parentNode.removeChild(extraList);
      placeKmore(prose,card);
      trimPoemArtOverflow(prose);
      return;
    }
    autoMore(prose,logoUrl);
  }
  /* v180: posts without a hand-written line get the card from the post list (same kind, same language first) */
  var autoMoreBusy=false;
  function autoMore(prose,logoUrl){
    if(autoMoreBusy||!window.fetch)return;
    var labs=Array.prototype.map.call(document.querySelectorAll('.post-labels a[data-label]'),function(a){return a.getAttribute('data-label')});
    if(!labs.length)return;
    var kind=labs.indexOf('Letters')>-1?'letters':labs.indexOf('Poetry')>-1?'poems':labs.indexOf('Stories')>-1?'stories':labs.indexOf('Articles')>-1?'essays':'';
    if(!kind)return;
    var K=KMORE[kind];
    var isNe=labs.indexOf('lang-ne')>-1||(document.documentElement.lang==='ne');
    var pair=labs.filter(function(l){return /^pair-/.test(l)})[0]||'';
    var ser=labs.filter(function(l){return /^series-/.test(l)})[0]||'';
    var topic=labs.indexOf('History')>-1?'History':labs.indexOf('Science')>-1?'Science':'';
    var here=location.pathname.replace(/\/+$/,'');
    autoMoreBusy=true;
    fetch('/feeds/posts/summary?alt=json&max-results=500&fields=feed/entry(id,title,link,published,category,media:thumbnail)')
      .then(function(r){return r.json()}).then(function(j){
        if(document.querySelector('.kmore-poems'))return;
        var hereDate=0,list=[];
        (j.feed.entry||[]).forEach(function(e){
          var u=((e.link||[]).filter(function(l){return l.rel==='alternate'})[0]||{}).href||'';
          var p=u.replace(/^https?:\/\/[^\/]+/,'').split('?')[0].replace(/\/+$/,'');
          var L=(e.category||[]).map(function(c){return c.term});
          var d=new Date((e.published||{}).$t||0).getTime();
          if(p===here){hereDate=d;return}
          if(L.indexOf(K.label)<0)return;
          if(pair&&L.indexOf(pair)>-1)return;
          if(ser&&L.indexOf(ser)>-1)return;
          list.push({href:p,text:normT((e.title||{}).$t),ne:L.indexOf('lang-ne')>-1,topic:topic&&L.indexOf(topic)>-1,d:d});
        });
        if(!hereDate)hereDate=Date.now();
        list.forEach(function(x){x.score=Math.abs(x.d-hereDate)/864e5+(x.ne===isNe?0:4000)-(x.topic?300:0)});
        list.sort(function(a,b){return a.score-b.score});
        var pick=list.filter(function(x){return x.text}).slice(0,3);
        if(!pick.length)return;
        var allHref={letters:'/p/letters.html',poems:isNe?'/p/nepali-kavita.html':'/p/nepali-kavita.html#poems-in-english',stories:'/p/stories.html',essays:topic==='History'?'/p/history.html':topic==='Science'?'/p/science.html':'/search/label/Articles'}[kind];
        var card=kmoreCard(kind,isNe,pick,{href:allHref},logoUrl);
        card.classList.add('is-auto');
        placeKmore(prose,card);
        trimPoemArtOverflow(prose);
      }).catch(function(){}).then(function(){autoMoreBusy=false});
  }
  function collapseLooseSummaries(prose,logoUrl){
    var reSum=/^(in short|key takeaways|at a glance|summary|tl;?dr|\u091b\u094b\u091f\u0915\u0930\u0940\u092e\u093e|\u0938\u0902\u0915\u094d\u0937\u0947\u092a\u092e\u093e|\u092e\u0941\u0916\u094d\u092f\s+\u092c\u0941\u0901\u0926\u093e)[\s:\u2014-]*$/i;
    var els=Array.prototype.slice.call(prose.querySelectorAll('h2, h3, h4, p'));
    els.forEach(function(el){
      if(!el.parentNode||el.closest('details'))return;
      var t=normT(el.textContent);
      if(!t||t.length>48||!reSum.test(t))return;
      var nxt=el.nextElementSibling;
      if(!nxt||!(nxt.tagName==='UL'||nxt.tagName==='OL'))return;
      var isNe=/[\u0900-\u097f]/.test(t);
      var cnt=nxt.querySelectorAll('li').length;
      var pill=cnt?(isNe?(cnt+' \u092c\u0941\u0901\u0926\u093e'):(cnt+' points')):(isNe?'\u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d':'Expand');
      var det=document.createElement('details');det.className='kshort-drop';
      var sum=document.createElement('summary');
      sum.innerHTML=makeSummaryHTML(t.replace(/[:\s]+$/,''),isNe?'\u0938\u093e\u0930\u093e\u0902\u0936':'Quick Summary',pill,logoUrl);
      var body=document.createElement('div');body.className='kd-body';
      body.appendChild(nxt);
      det.appendChild(sum);det.appendChild(body);
      el.parentNode.insertBefore(det,el);
      el.parentNode.removeChild(el);
    });
  }
  function collapseLooseFaq(prose,logoUrl){
    var reFaq=/^(faq|faqs|frequently asked questions|common questions|\u092a\u094d\u0930\u0936\u094d\u0928\u094b\u0924\u094d\u0924\u0930|\u091c\u093f\u091c\u094d\u091e\u093e\u0938\u093e|\u0938\u093e\u092e\u093e\u0928\u094d\u092f\s+\u092a\u094d\u0930\u0936\u094d\u0928\u0939\u0930\u0942)[\s:]*$/i;
    var els=Array.prototype.slice.call(prose.querySelectorAll('h2, h3, h4, p'));
    els.forEach(function(el){
      if(!el.parentNode||el.closest('details'))return;
      var t=normT(el.textContent);
      if(!t||t.length>64||!reFaq.test(t))return;
      var nodes=[],cur=el.nextElementSibling;
      while(cur){
        if(cur.tagName==='H2'||cur.tagName==='DETAILS'||(cur.classList&&(cur.classList.contains('kalso-card')||cur.classList.contains('kser-bot')||cur.classList.contains('end-doodle'))))break;
        nodes.push(cur);cur=cur.nextElementSibling;
      }
      if(!nodes.length)return;
      var isNe=/[\u0900-\u097f]/.test(t);
      var qCnt=nodes.filter(function(n){return n.tagName==='H3'||n.tagName==='H4'||(n.tagName==='P'&&n.querySelector('strong,b'))}).length;
      var pill=qCnt?(isNe?(qCnt+' \u092a\u094d\u0930\u0936\u094d\u0928'):(qCnt+' Q&A')):(isNe?'\u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d':'Expand');
      var det=document.createElement('details');det.className='kfaq-box';
      var sum=document.createElement('summary');
      sum.innerHTML=makeSummaryHTML(t.replace(/[:\s]+$/,''),isNe?'\u092a\u094d\u0930\u0936\u094d\u0928\u094b\u0924\u094d\u0924\u0930':'FAQ',pill,logoUrl);
      var body=document.createElement('div');body.className='kfaq-body';
      nodes.forEach(function(n){body.appendChild(n)});
      det.appendChild(sum);det.appendChild(body);
      el.parentNode.insertBefore(det,el);
      el.parentNode.removeChild(el);
    });
  }
  function decorateExistingDrawers(prose,logoUrl){
    if(!logoUrl)return;
    var ds=prose.querySelectorAll('details.kshort-drop>summary, details.kfaq-box>summary, details.kref-box>summary');
    Array.prototype.forEach.call(ds,function(sum){
      if(sum.querySelector('.kd-logo'))return;
      var ico=sum.querySelector('.kd-ico');
      var img=document.createElement('img');img.className='kd-logo';img.alt='';img.src=logoUrl;
      if(ico&&ico.parentNode){ico.parentNode.replaceChild(img,ico)}
      else{sum.insertBefore(img,sum.firstChild)}
    });
  }
  function buildLongArticleTOC(prose,logoUrl){
    if(!prose||prose.querySelector('details.ktoc-box'))return;
    if(prose.querySelector('.poem-row, .verse')||prose.classList.contains('poem'))return;
    var hs=Array.prototype.filter.call(prose.querySelectorAll('h2, h3'),function(h){
      if(h.closest('details, .kalso-card, .kser-bot, .kmore-poems'))return false;
      var t=normT(h.textContent);
      if(!t||t.length<3||t.length>140)return false;
      if(/^(in short|summary|faq|frequently asked|references|sources|read next|also read|\u091b\u094b\u091f\u0915\u0930\u0940\u092e\u093e|\u0938\u094d\u0930\u094b\u0924|\u0938\u0928\u094d\u0926\u0930\u094d\u092d|\u092f\u094b \u092a\u0928\u093f \u092a\u0922\u094d\u0928\u0941\u0939\u094b\u0938\u094d)/i.test(t))return false;
      return true;
    });
    if(hs.length<3)return;
    var isNe=(window.KAFKA_PAGE&&window.KAFKA_PAGE.lang==='ne')||/[\u0900-\u097f]/.test(hs[0].textContent||'');
    var det=document.createElement('details');det.className='ktoc-box';
    var sum=document.createElement('summary');
    var pill=isNe?(hs.length+' \u0916\u0923\u094d\u0921'):(hs.length+' sections');
    sum.innerHTML=makeSummaryHTML(isNe?'\u0935\u093f\u0937\u092f\u0938\u0942\u091a\u0940':'Table of Contents',isNe?'\u0932\u0947\u0916 \u0928\u0915\u094d\u0938\u093e':'In This Piece',pill,logoUrl);
    var body=document.createElement('div');body.className='kd-body';
    var ol=document.createElement('ol');ol.className='ktoc-list';
    var secN=0;
    hs.forEach(function(h,idx){
      if(!h.id)h.id='ksec-'+(idx+1);
      var li=document.createElement('li');
      if(h.tagName==='H3')li.className='is-h3';
      else secN++;
      var a=document.createElement('a');a.href='#'+h.id;
      var num=document.createElement('span');num.className='ktoc-num';
      num.textContent=h.tagName==='H3'?'\u00b7':(secN<10?'0'+secN:String(secN));
      var tx=document.createElement('span');tx.textContent=normT(h.textContent);
      a.appendChild(num);a.appendChild(tx);li.appendChild(a);ol.appendChild(li);
    });
    body.appendChild(ol);det.appendChild(sum);det.appendChild(body);
    var anchor=prose.querySelector('details.kshort-drop')||prose.querySelector('.kafka-cover');
    if(anchor&&anchor.parentNode===prose){anchor.after(det)}
    else{prose.insertBefore(det,prose.firstChild)}
  }
  function trimPoemArtOverflow(prose){
    var row=prose.querySelector('.poem-row');
    if(!row)return;
    var body=row.querySelector('.poem-body'),col=row.querySelector('.poem-art');
    if(!body||!col)return;
    var kids=Array.prototype.filter.call(body.children,function(c){return c.offsetHeight>0});
    if(!kids.length)return;
    var bodyEnd=kids[kids.length-1].getBoundingClientRect().bottom;
    var items=Array.prototype.slice.call(col.querySelectorAll('.pa-item'));
    var hasLead=!!col.querySelector('.lead-pic');
    for(var i=items.length-1;i>=0;i--){
      if(i===0&&!hasLead)break;
      var rect=items[i].getBoundingClientRect();
      if(rect.bottom>bodyEnd+60){
        items[i].parentNode.removeChild(items[i]);
      }
    }
  }
  function runAll(){
    var kv=document.getElementById('kview');
    if(!kv||(kv.getAttribute('data-view')||'')!=='post')return;
    var prose=document.querySelector('.prose');
    if(!prose)return;
    var logoUrl=artUrl('favicon',120)||artUrl('birds',120);
    upgradeMorePoems(prose,logoUrl);
    collapseLooseSummaries(prose,logoUrl);
    collapseLooseFaq(prose,logoUrl);
    decorateExistingDrawers(prose,logoUrl);
    buildLongArticleTOC(prose,logoUrl);
    trimPoemArtOverflow(prose);
    setTimeout(function(){trimPoemArtOverflow(prose)},400);
    setTimeout(function(){trimPoemArtOverflow(prose)},1100);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(runAll,90)})}
  else{setTimeout(runAll,90)}
  window.addEventListener('load',function(){setTimeout(runAll,120)});
})();
;
/* v153 collection headers + list pictures */
(function(){function go(){try{(function(){
 var art=document.querySelector('.static-page'); if(!art||art.querySelector('.page-head'))return;
 var h1=art.querySelector('h1'); if(!h1)return;
 var M={'/p/letters.html':['Collection','चिठी','Letters','letters'],'/p/nepali-kavita.html':['Collection','कविता','Poetry','poetry'],'/p/history.html':['Collection','इतिहास','History','history'],'/p/science.html':['Collection','विज्ञान','Science','science'],'/p/stories.html':['Collection','कथा','Stories','stories'],'/p/photos.html':['Collection','तस्बिर','Photos','photographs'],'/p/books.html':['Collection','','Books','books'],'/p/movies.html':['Collection','','Movies','movies'],'/p/songs.html':['Collection','','Songs','songs'],'/p/series.html':['Collection','','Series','series']};
 var m=M[location.pathname.replace(/\/+$/,'')]; var items=art.querySelectorAll('ol.kser-items>li');
 if(!m&&!items.length)return;
 var D=window.KAFKA_DOODLES||{};
 var head=document.createElement('div'); head.className='list-head page-head';
 var k=document.createElement('p'); k.className='count'; k.textContent=m?m[0]:'Series'; head.appendChild(k);
 h1.parentNode.insertBefore(head,h1); head.appendChild(h1);
 if(m&&m[1]){h1.setAttribute('data-full',h1.textContent);h1.innerHTML='<span class="ne" lang="ne">'+m[1]+'</span><span class="sl">/</span><span lang="en">'+m[2]+'</span>';}
 var src=D[m?m[3]:'series']||D.book; if(src){var im=document.createElement('img');im.alt='';im.className='head-doodle';im.src=src;head.appendChild(im);}
 var intro0=art.querySelector('.kser-intro');if(intro0){intro0.style.setProperty('text-align','left','important');intro0.style.setProperty('hyphens','none','important');}
 var tabs=art.querySelectorAll('.kser-tabs>label span');var n=items.length;
 if(n){var mt=document.createElement('p');mt.className='page-meta';mt.textContent=(tabs.length===2)?(tabs[0].textContent+' Nepali poems · '+tabs[1].textContent+' in English'):n+(m?(n===1?' piece':' pieces'):(n===1?' part':' parts'))+(m?'':', in reading order');(intro0||head).insertAdjacentElement('afterend',mt);}
})();
(function(){
 var lis=document.querySelectorAll('.static-page ol.kser-items>li'); if(!lis.length||document.querySelector('.kser-pic'))return;
 function norm(u){try{return new URL(u,location.href).pathname.replace(/\/+$/,'');}catch(e){return u}}
 function apply(map){Array.prototype.forEach.call(lis,function(li){var a=li.querySelector('h2 a');if(!a)return;var th=map[norm(a.getAttribute('href'))];var box=document.createElement('a');box.className='kser-pic'+(th?'':' none');box.href=a.getAttribute('href');box.setAttribute('aria-hidden','true');box.tabIndex=-1;
  var n=Array.prototype.indexOf.call(li.parentNode.children,li)+1;
  box.innerHTML=(th?'<img loading="lazy" alt="" src="'+th+'">':'')+'<span class="kser-n">'+n+'</span>';li.insertBefore(box,li.firstChild);li.classList.add('has-pic');});}
 var KEY='kafka-thumbs-v2',map=null;try{var c=JSON.parse(sessionStorage.getItem(KEY)||'null');if(c&&Date.now()-c.t<36e5)map=c.m}catch(e){}
 if(map){apply(map);return}
 map={};
 function page(si){return fetch('/feeds/posts/summary?alt=json&max-results=150&start-index='+si).then(function(r){return r.json()}).then(function(j){var es=(j.feed&&j.feed.entry)||[];es.forEach(function(e){var l=((e.link||[]).filter(function(x){return x.rel==='alternate'})[0]||{}).href;if(l&&e.media$thumbnail)map[norm(l)]=e.media$thumbnail.url.replace(/=s72(-w\d+)?(-h\d+)?(-c)?$/,'=w400').replace(/\/s72(-w\d+)?(-h\d+)?(-c)?\//,'/s400/');});return {n:es.length,total:+((j.feed.openSearch$totalResults||{}).$t||0)};});}
 function all(si){return page(si).then(function(r){var nx=si+r.n;return(r.n&&nx<=r.total&&nx<400)?all(nx):0})}
 all(1).then(function(){try{sessionStorage.setItem(KEY,JSON.stringify({t:Date.now(),m:map}))}catch(e){}apply(map)}).catch(function(){});
})();}catch(e){}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
;
/* v154 phone post layout + category art */
(function(){function go(){try{(function(){if(!window.matchMedia||!matchMedia('(max-width:700px)').matches)return;function strip(el){if(!el)return;var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n;while(n=w.nextNode()){n.nodeValue=n.nodeValue.replace(/\s*\([^)]*\)/g,'');}}strip(document.querySelector('header.post-head .tr-cta'));var sn=document.querySelector('.kser-mini .kser-mini-name');if(sn){sn.title=sn.textContent;strip(sn);}})();
(function(){try{var h=document.querySelector('.hero');if(!h)return;var m=getComputedStyle(h).backgroundImage.match(/url\("?([^")]+)"?\)/);if(m)document.documentElement.style.setProperty('--kcat-art','url("'+m[1]+'")');}catch(e){}})();}catch(e){}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
;
/* v155 homepage layout + combined pin */
(function(){function go(){try{(function(){if(!document.querySelector('#kview[data-view="home"]'))return;function mark(){var box=document.querySelector('.home-main');if(!box)return;[].forEach.call(box.querySelectorAll('article.plane'),function(a){if(a.closest('.pin-pair'))return;var l=a.querySelector('.k-label');if(l&&/^\s*Featured\s*$/i.test(l.textContent)){a.classList.add('kfeat');a.classList.remove('krow')}else if(!a.classList.contains('kfeat'))a.classList.add('krow')})}mark();var n=0;var mo=new MutationObserver(function(){mark()});var hm=document.querySelector('.home-main');if(hm)mo.observe(hm,{childList:true,subtree:true});setTimeout(function(){mo.disconnect()},15000);})();
(function(){if(!document.querySelector('#kview[data-view="home"]'))return;if(!matchMedia('(max-width:700px)').matches)return;var t=document.querySelector('.three');if(!t||t.querySelector('.ktabs3'))return;var cols=[].slice.call(t.children).filter(function(c){return c.classList.contains('col')});if(cols.length<3)return;var order=[[cols[0],'Recent posts'],[cols[2],'Most read'],[cols[1],'Archive & Series']];var bar=document.createElement('div');bar.className='ktabs3';bar.setAttribute('role','tablist');order.forEach(function(o,i){var b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.textContent=o[1];b.setAttribute('aria-selected',i?'false':'true');if(!i)o[0].classList.add('kon');b.onclick=function(){order.forEach(function(p,j){p[0].classList.toggle('kon',j===i);bar.children[j].setAttribute('aria-selected',j===i?'true':'false')})};bar.appendChild(b)});t.insertBefore(bar,t.firstChild);})();
(function(){var tries=0;function t(){tries++;var pp=document.querySelector('.pin-pair');if(pp&&pp.querySelectorAll('article').length===2&&!pp.classList.contains('kps-done')){try{(function(){(function(){
 if(!document.querySelector('#kview[data-view="home"]'))return;
 var pp=document.querySelector('.pin-pair');if(!pp||pp.classList.contains('kps-done'))return;
 var arts=[].slice.call(pp.querySelectorAll('article'));
 if(arts.length!==2||!arts.every(function(a){var h=a.querySelector('h3 a');return h&&/bifar/.test(h.getAttribute('href'))}))return;
 arts.sort(function(a,b){return /bhag-1/.test(a.querySelector('h3 a').href)?-1:1});
 var EN={'bhag-1':'https://www.kafka.blog/2026/11/smallpox-in-nepal-part-1-rana-bahadur-shitala-maju.html','bhag-2':'https://www.kafka.blog/2026/11/smallpox-in-nepal-part-2-vaccine-159-years.html'};
 var IMG='https://lh3.googleusercontent.com/d/1qEaYs8sB7xAtbPbDOT0rzzbj-WtTBXYy=w700';
 var wrap=document.createElement('article');wrap.className='kps';wrap.setAttribute('lang','ne');
 var first=arts[0].querySelector('h3 a').getAttribute('href');
 var chip=arts[0].querySelector('.chip');
 var h='<a class="kps-pic" href="'+first+'" tabindex="-1" aria-hidden="true"><img loading="lazy" alt="" src="'+IMG+'"></a><div class="kps-body"><div class="kps-head"><p class="kps-k"><span class="k-label" lang="en">Pinned</span>'+(chip?chip.outerHTML:'')+'<span class="kps-n" lang="en">2-part series</span></p><h3 class="kps-t"><a href="'+first+'">बिफरको नेपाली इतिहास</a></h3><p class="kps-cap" lang="en">Sheetala, goddess of smallpox. Kalighat painting, c. 1890 · Cleveland Museum of Art (CC0)</p></div><ol class="kps-parts"></ol></div>';
 wrap.innerHTML=h;var ol=wrap.querySelector('.kps-parts');
 arts.forEach(function(a,i){var link=a.querySelector('h3 a');var href=link.getAttribute('href');var t=link.textContent.replace(/^.*?\(भाग\s*[०-९0-9]+\)\s*[:：]\s*/,'');var li=document.createElement('li');
  var key=/bhag-1/.test(href)?'bhag-1':'bhag-2';
  li.innerHTML='<span class="kps-no">भाग '+(i?'२':'१')+'</span><div class="kps-pt"><a class="tt" href="'+href+'">'+t+'</a><div class="kps-row"></div></div>';
  var row=li.querySelector('.kps-row');var acts=a.querySelector('.kcard-acts');if(acts)row.appendChild(acts);
  if(EN[key]){var e=document.createElement('a');e.className='kps-en';e.href=EN[key];e.setAttribute('lang','en');e.textContent='Read in English ›';row.appendChild(e);}
  var meta=a.querySelector('.meta-row');if(meta){var m=document.createElement('p');m.className='kps-meta meta-row';m.innerHTML=meta.innerHTML;li.querySelector('.kps-pt').appendChild(m);}
  ol.appendChild(li);});
 pp.innerHTML='';pp.appendChild(wrap);pp.classList.add('kps-done');
})();})()}catch(e){}}if(tries<30&&!(pp&&pp.classList.contains('kps-done')))setTimeout(t,500)}t();})();}catch(e){}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
;
/* v156-157 phone tabs, collapse, pin descriptions */
(function(){function go(){try{(function(){if(!matchMedia('(max-width:700px)').matches)return;var t=document.querySelector('.three');if(!t||t.querySelector('.ktabs3'))return;var cols=[].slice.call(t.children).filter(function(c){return c.classList.contains('col')});if(cols.length<3)return;t.classList.add('ktabbed');var order=[[cols[0],'Recent posts'],[cols[2],'Most read'],[cols[1],'Archive & Series']];var bar=document.createElement('div');bar.className='ktabs3';bar.setAttribute('role','tablist');order.forEach(function(o,i){var b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.textContent=o[1];b.setAttribute('aria-selected',i?'false':'true');if(!i)o[0].classList.add('kon');b.onclick=function(){order.forEach(function(p,j){p[0].classList.toggle('kon',j===i);bar.children[j].setAttribute('aria-selected',j===i?'true':'false')})};bar.appendChild(b)});t.insertBefore(bar,t.firstChild);})();}catch(e){}
try{(function(){
 /* v180: lists page with Previous / Next — 5 per page in the footer, 10 on collection and series pages */
 var NE=document.documentElement.lang==='ne';
 function items(list){return [].filter.call(list.children,function(c){return c.tagName==='LI'||c.classList.contains('kser-row')})}
 function perFor(list){if(list.closest('.three,.kfoot'))return window.innerWidth<701?5:10;if(list.closest('.related'))return window.innerWidth<700?4:99;return 10}
 function setup(list){
  if(list.closest('.kpager')||list.parentNode.querySelector(':scope > .kpager:not(.kpg2)'))return;
  var its=items(list),per=perFor(list),st=list.__kpg||(list.__kpg={page:0});
  var nav=st.nav;
  if(its.length<=per){its.forEach(function(x){x.classList.remove('kpg-off')});if(nav&&nav.parentNode)nav.parentNode.removeChild(nav);return}
  var pages=Math.ceil(its.length/per);if(st.page>pages-1)st.page=pages-1;
  if(!nav){nav=st.nav=document.createElement('div');nav.className='kpager kpg2';
   nav.innerHTML='<div class="nav"><button type="button" data-go="-1">‹ '+(NE?'अघिल्लो':'Previous')+'</button><button type="button" data-go="1">'+(NE?'अर्को':'Next')+' ›</button></div><span class="count"></span>';
   [].forEach.call(nav.querySelectorAll('button'),function(b){b.onclick=function(){var p2=Math.ceil(items(list).length/per);st.page=Math.max(0,Math.min(p2-1,st.page+ +b.getAttribute('data-go')));draw();var r=list.getBoundingClientRect();if(r.top<0||r.top>innerHeight*.6)list.scrollIntoView({block:'start',behavior:'smooth'})}});
  }
  if(nav.previousElementSibling!==list)list.insertAdjacentElement('afterend',nav);
  function draw(){var its2=items(list),from=st.page*per;its2.forEach(function(x,k){x.classList.toggle('kpg-off',k<from||k>=from+per)});var bs=nav.querySelectorAll('button');bs[0].disabled=st.page===0;bs[1].disabled=from+per>=its2.length;nav.querySelector('.count').textContent=(from+1)+'–'+Math.min(from+per,its2.length)+(NE?' / ':' of ')+its2.length}
  draw();
 }
 function scan(){[].forEach.call(document.querySelectorAll('.three .kserlist, .three .half ol, .three .half ul, .static-page ol.kser-items, .static-page .kserlist, .related ol, .related ul'),function(l){if(!l.closest('nav,.widget,.BlogArchive,.arch-hidden'))setup(l)})}
 [].forEach.call(document.querySelectorAll('.kcl-btn'),function(b){b.remove()});
 scan();var mo=new MutationObserver(function(){clearTimeout(mo.t);mo.t=setTimeout(scan,150)});mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){mo.disconnect()},25000);
})();}catch(e){}
try{(function(){var D={'bhag-1':'सन् १७९९ मा बिफर दरबारभित्र पस्यो। रणबहादुरले बिफर लागेका बच्चालाई परिवारसहित उपत्यकाबाट लखेटे, र त्यो पीडा शीतला माजु भजनमा बाँच्यो।','bhag-2':'शीतला माजु को हुन्, बिफर जाडोमै किन फर्किन्थ्यो, खोप ढोकामा हुँदा राजा गिर्वाण कसरी बिते, र नेपालले बिफर कसरी हटायो।'};var n=0;function t(){n++;var lis=document.querySelectorAll('.kps-parts>li');if(lis.length){[].forEach.call(lis,function(li){if(li.querySelector('.kps-d'))return;var a=li.querySelector('.tt');var k=/bhag-1/.test(a.href)?'bhag-1':(/bhag-2/.test(a.href)?'bhag-2':'');if(!D[k])return;var p=document.createElement('p');p.className='kps-d';p.textContent=D[k];a.insertAdjacentElement('afterend',p)});return}if(n<40)setTimeout(t,500)}t();})();}catch(e){}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
;
/* v158 captions: drop duplicate generated captions, drop dividers next to pictures/captions/headings */
(function(){function go(){try{(function(){
 function norm(s){return (s||'').replace(/[\s\u00a0]+/g,' ').replace(/[“”"'’‘\.।,:;!?()\-–—]/g,'').trim().toLowerCase()}
 function isPic(e){return !!(e&&e.nodeType===1&&(/^(FIGURE|TABLE)$/.test(e.tagName)||e.classList.contains('kimg-cap')||e.classList.contains('kprose-art')||e.classList.contains('separator')&&e.querySelector('img')||e.querySelector&&e.querySelector('img:not(.dink),iframe,video')))}
 function isHead(e){return !!(e&&/^H[1-6]$/.test(e.tagName))}
 function isCap(e){if(!e||e.nodeType!==1)return false;if(e.classList.contains('tr-caption')||e.tagName==='FIGCAPTION')return true;if(e.tagName!=='P')return false;var t=(e.textContent||'').trim();if(!t||t.length>240)return false;var it=e.querySelector('em,i');if(it&&norm(it.textContent)===norm(t))return true;var cs=getComputedStyle(e);return cs.textAlign==='center'&&t.length<180}
 function words(s){return norm(s).split(' ').filter(function(w){return w.length>2})}function similar(a,b){var A=words(a),B=words(b);if(!A.length||!B.length)return false;var set={};A.forEach(function(w){set[w]=1});var hit=B.filter(function(w){return set[w]}).length;return hit/Math.min(A.length,B.length)>=0.5}
 function run(){
  var prose=document.querySelector('.prose');if(!prose)return;
  [].slice.call(prose.querySelectorAll('.kimg-cap')).forEach(function(c){
   var t=norm(c.textContent);var block=c;while(block.parentElement&&block.parentElement!==prose)block=block.parentElement;
   var dup=false;var tbl=c.closest('table');if(tbl&&tbl.querySelector('.tr-caption')&&norm(tbl.querySelector('.tr-caption').textContent))dup=true;
   var fig=c.closest('figure');if(fig&&fig.querySelector('figcaption')&&fig.querySelector('figcaption')!==c)dup=true;
   if(!dup&&block!==c){var own=norm(block.textContent.replace(c.textContent,''));if(own&&own.length>3)dup=true}
   var s=block.nextElementSibling,k=0;while(!dup&&s&&k<3){if(s.classList.contains('dinkus')||!norm(s.textContent)&&!s.querySelector('img')){s=s.nextElementSibling;continue}var st=norm(s.textContent);if(st&&(st===t||st.indexOf(t)===0||t&&t.indexOf(st)===0&&st.length>15)||k===0&&isCap(s)||k===0&&(s.textContent||'').trim().length<200&&similar(s.textContent,c.textContent))dup=true;break}
   if(dup)c.parentNode.removeChild(c);
  });
  [].slice.call(prose.querySelectorAll('.dinkus')).forEach(function(d){
   var p=d.previousElementSibling,n=d.nextElementSibling;
   if(!p||!n||isPic(p)||isPic(n)||isHead(p)||isHead(n)||isCap(n)||isCap(p)||n.classList.contains('dinkus')||/^(BLOCKQUOTE|HR|TABLE)$/.test(n.tagName)||/^(BLOCKQUOTE|HR)$/.test(p.tagName))d.parentNode.removeChild(d);
  });
 }
 run();setTimeout(run,1200);setTimeout(run,3000);
})();}catch(e){}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
;
/* v159 Shitala Maju pin: bhajan lede and quote */
(function(){function go(){try{(function(){var n=0;function t(){n++;var k=document.querySelector('.kps');if(!k){if(n<40)setTimeout(t,500);return}if(k.querySelector('.kps-bhajan'))return;var head=k.querySelector('.kps-head');var p1=(k.querySelector('.kps-t a')||{}).getAttribute?k.querySelector('.kps-t a').getAttribute('href'):'/2026/11/bifar-nepali-itihas-bhag-1-shitala-maju.html';var box=document.createElement('div');box.className='kps-bhajan';box.innerHTML='<p class="kps-lede">उपत्यकाबाट लखेटिएकाहरूले आफ्नो पीडा कुनै अभिलेखमा लेखाउन पाएनन्, तर त्यो पीडा गीत बनेर बाँच्यो। दुई सय वर्ष पुरानो यो नेवारी लोकगीतमा राजाको नाम छ, बिफरकी देवीसँगको बिन्ती छ।</p><blockquote><p class="kb-orig">“…परजान अति दु:ख सिलमते मते सितला माजु सहश्र बिनति छिके, याहुने लोक उधार।”</p><p class="kb-tr">“नगर, नगर शीतला माजु, हजार बिन्ती छ, यो लोकको उद्धार गर।”</p><cite>— शीतला माजु भजन, नेपाल भाषा</cite></blockquote><a class="kps-cta" href="'+p1+'">भजनको कथा पढ्नुहोस् ›</a>';var cap=k.querySelector('.kps-cap');(cap||head).insertAdjacentElement('afterend',box);}t();})();}catch(e){}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
;
/* v160 landing: where to start, language switch, part 1 buttons, first visit */
(function(){function go(){try{(function(){
 if(!document.querySelector('#kview[data-view="home"]'))return;
 var A=window.KAFKA_ART||{};function art(k,w){return A[k]?'https://lh3.googleusercontent.com/d/'+A[k]+'=w'+(w||600):''}
 var LS={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
 var SS={get:function(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};
 var first=false;if(!LS.get('kafka-seen')){LS.set('kafka-seen',String(Date.now()));SS.set('kafka-first','1')}if(SS.get('kafka-first')&&!LS.get('kafka-welcome-off'))first=true;
 if(first)document.documentElement.classList.add('kfirst');
 var hero=document.querySelector('body>section.wrap');if(!hero||document.querySelector('.kdoors'))return;
 var D=[['/p/history.html','header-history','इतिहास','History','Sumer, Roman Britannia, smallpox in Nepal'],['/p/science.html','header-science','विज्ञान','Science','Cancer and viruses, eels and lobsters'],['/p/nepali-kavita.html','header-poetry','कविता','Poetry','Poems in Nepali and English'],['/p/letters.html','header-letters','चिठी र कथा','Letters & stories','Letters, mostly unsent, and short stories']];
 var s=document.createElement('section');s.className='kdoors';s.setAttribute('aria-label','Where to start');
 var h='<div class="kd-top"><div><p class="kd-eyebrow">Where to start · कहाँबाट सुरु गर्ने?</p><p class="kd-line">History, science, poems and letters, in Nepali and English, by बासभ.</p></div><div class="kd-lang" role="group" aria-label="Language"><button type="button" data-l="all">All</button><button type="button" data-l="ne" lang="ne">नेपाली</button><button type="button" data-l="en">English</button></div></div>';
 var PICKS=[['/2025/04/hippies.html','History · English','Hippies: Music, Marijuana, Magic Bus and Kathmandu','How Kathmandu became the last stop of the hippie dream',''],['/2026/11/bifar-nepali-itihas-bhag-1-shitala-maju.html','History · नेपाली','बिफरको नेपाली इतिहास (भाग १): शीतला माजु','दरबारबाट लखेटिएकाहरूको पीडा, एउटा भजनमा','https://lh3.googleusercontent.com/d/1qEaYs8sB7xAtbPbDOT0rzzbj-WtTBXYy=w700'],['/2026/11/the-mysterious-life-of-the-eel-guests-of-the-river-children-of-the-sea.html','Science · English','The Mysterious Life of the Eel','Born in the ocean, raised in rivers, back to the sea','https://lh3.googleusercontent.com/d/1d3rkxX9NWDjsoSyS7Kwph0bUGPRy3kBy=w240']];
 if(first)h+='<div class="kd-welcome"><button type="button" class="kd-x" aria-label="Close">×</button><div class="kd-wh"><span class="kd-wbadge">New here?</span><span class="kd-wt">Three good places to begin</span></div><div class="kd-picks">'+PICKS.map(function(p,i){return '<a class="kd-pick" href="'+p[0]+'"'+(/नेपाली/.test(p[1])?' lang="ne"':'')+'><span class="kd-pth" data-src="'+p[4]+'"><b>'+(i+1)+'</b></span><span class="kd-ptx"><span class="kd-pk" lang="en">'+p[1]+'</span><span class="kd-ptt">'+p[2]+'</span><span class="kd-pds">'+p[3]+'</span></span></a>'}).join('')+'</div></div>';
 h+='<div class="kd-grid">'+D.map(function(d){return '<a class="kd-door" href="'+d[0]+'" style="--dart:url('+art(d[1],700)+')"><span class="kd-ne" lang="ne">'+d[2]+'</span><span class="kd-en">'+d[3]+'</span><span class="kd-sub">'+d[4]+'</span><span class="kd-go">Explore ›</span></a>'}).join('')+'</div>';
 s.innerHTML=h;var sl=document.getElementById('kdoors-slot');if(sl)sl.replaceWith(s);else hero.insertAdjacentElement('afterend',s);
 function thumbs(){[].forEach.call(s.querySelectorAll('.kd-pick'),function(a){var th=a.querySelector('.kd-pth');if(th.querySelector('img'))return;var path=a.getAttribute('href');var src=th.getAttribute('data-src');if(!src){var im=[].filter.call(document.querySelectorAll('a[href$="'+path+'"] img'),function(i){return i.currentSrc||i.getAttribute('src')})[0];if(im)src=(im.currentSrc||im.getAttribute('src')).replace(/=w\d+$/,'=w240')}if(src){var i=document.createElement('img');i.alt='';i.loading='lazy';i.src=src;th.insertBefore(i,th.firstChild)}})}thumbs();setTimeout(thumbs,1500);setTimeout(thumbs,4000);
 var x=s.querySelector('.kd-x');if(x)x.onclick=function(){LS.set('kafka-welcome-off','1');document.documentElement.classList.remove('kfirst');var w=s.querySelector('.kd-welcome');if(w)w.remove()};
 function apply(l){document.documentElement.setAttribute('data-klang',l);[].forEach.call(s.querySelectorAll('.kd-lang button'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-l')===l?'true':'false')});LS.set('kafka-lang',l);
  var items=document.querySelectorAll('.home-main article:not(.kfeat):not(.kps), .three .klist>li');
  [].forEach.call(items,function(a){var ne=(a.getAttribute('lang')||'').indexOf('ne')===0;var hide=l==='ne'?!ne:(l==='en'?ne:false);a.classList.toggle('klang-off',hide)});}
 [].forEach.call(s.querySelectorAll('.kd-lang button'),function(b){b.onclick=function(){apply(b.getAttribute('data-l'))}});
 var cur=LS.get('kafka-lang')||'all';apply(cur);
 var hm=document.querySelector('.home-main')||document.body;var mo=new MutationObserver(function(){clearTimeout(mo.t);mo.t=setTimeout(function(){apply(document.documentElement.getAttribute('data-klang')||'all')},150)});mo.observe(hm,{childList:true,subtree:true});var th=document.querySelector('.three');if(th)mo.observe(th,{childList:true,subtree:true});setTimeout(function(){mo.disconnect()},20000);
})();}catch(e){}
try{(function(){
 if(!document.querySelector('#kview[data-view="home"]'))return;
 var P1={'/p/sumer.html':['/2026/11/flood-that-drowned-the-world-wrangel-mammoths-sumer.html','/2026/11/sansar-dubaeko-badhi-himhatti-wrangel.html'],'/p/roman-britannia.html':['/2026/11/story-of-roman-britannia-part-1-work-of-giants.html','/2026/11/roman-britannia-bhag-1-daityaharuko-kaam.html'],'/p/biology-and-cancer.html':['/2026/09/rosalind-franklin-the-dark-lady-of-dna.html','/2026/09/rosalind-franklin-nepali.html'],'/p/organisms.html':['/2025/11/eels.html','/2025/11/eels.html']};
 function go(){var cards=document.querySelectorAll('.series2 .scol');if(!cards.length)return false;var ne=document.documentElement.getAttribute('data-klang')==='ne';
  [].forEach.call(cards,function(card){var a=card.querySelector('h3 .ser-link');if(!a)return;var p=P1[a.getAttribute('href')];if(!p)return;var b=card.querySelector('.kp1');if(!b){b=document.createElement('a');b.className='kp1';var run=card.querySelector('details.run')||card.querySelector('h3');run.insertAdjacentElement('beforebegin',b)}b.href=ne?p[1]:p[0];b.textContent=ne?'भाग १ बाट सुरु गर्नुहोस् ›':'Start from Part 1 ›';if(ne)b.setAttribute('lang','ne');else b.removeAttribute('lang')});return true}
 var n=0;(function t(){if(!go()&&n++<30)setTimeout(t,500)})();
 new MutationObserver(function(){go()}).observe(document.documentElement,{attributes:true,attributeFilter:['data-klang']});
})();}catch(e){}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
;
/* v161 tablet menu position */
(function(){function go(){try{(function(){if(!matchMedia('(min-width:701px) and (max-width:1100px)').matches)return;function fix(){var t=document.querySelector('.knav-sticky .tabs-items');if(!t)return;var act=t.querySelector('a[aria-current],a.active,a.is-active,a.on');if(act&&act.offsetParent){var l=act.offsetLeft-24;t.scrollLeft=Math.max(0,l)}else t.scrollLeft=0}setTimeout(fix,300);setTimeout(fix,1500);})();}catch(e){}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
;
/* v162 phone poems: photo into the right column like desktop */
(function(){function go(){try{(function(){var n=0;function t(){n++;try{(function(){(function(){if(!matchMedia('(max-width:700px)').matches)return;var pr=document.querySelector('.prose.poem.has-rail');if(!pr)return;var rail=pr.querySelector('.art-rail');var body=pr.querySelector('.poem-body');if(!rail||!body||rail.querySelector('.kpoem-photo'))return;var p=[].filter.call(body.children,function(c){return c.tagName==='P'&&c.querySelector('img')&&(c.textContent||'').trim().length<160})[0];if(!p)return;var cap=p.nextElementSibling;var w=document.createElement('div');w.className='kpoem-photo';w.appendChild(p);if(cap&&cap.tagName==='P'&&(cap.textContent||'').trim().length<120&&!cap.querySelector('img')&&cap.previousElementSibling===null){}rail.insertBefore(w,rail.firstChild);})();})()}catch(e){}if(!document.querySelector('.kpoem-photo')&&document.querySelector('.prose.poem')&&n<30)setTimeout(t,400)}t();})();}catch(e){}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();

/* v180: collection & series lists — newest first, numbered, original language first, icon actions (narration · translation · share) */
(function(){
  var ICO={
    listen:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.6"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.6"/></svg>',
    tr:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 5h9M8 3v2M5.5 5c.6 3.3 2.7 6.1 6 7.6M10.5 5c-.8 3.9-3.2 6.9-7 8.5"/><path d="M13 21l4-10 4 10M14.5 17.5h5"/></svg>',
    share:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>'
  };
  function np(u){return String(u||'').replace(/^https?:\/\/[^\/]+/,'').split('?')[0].split('#')[0].replace(/\/+$/,'')}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
  function run(){
    var lists=document.querySelectorAll('.static-page ol.kser-items');
    if(!lists.length||!window.fetch)return;
    var man=window.KAFKA_GET_MANIFEST?window.KAFKA_GET_MANIFEST().catch(function(){return {}}):Promise.resolve({});
    var feed=fetch('/feeds/posts/summary?alt=json&max-results=500&fields=feed/entry(id,title,link,published,category,media:thumbnail)').then(function(r){return r.json()});
    Promise.all([feed,man]).then(function(res){
      var byPath={},byTitle={},pairs={};
      ((res[0].feed||{}).entry||[]).forEach(function(e){
        var p=np(((e.link||[]).filter(function(l){return l.rel==='alternate'})[0]||{}).href);
        var L=(e.category||[]).map(function(c){return c.term});
        var t=((e.title||{}).$t||'').trim();
        var o={p:p,t:t,d:new Date((e.published||{}).$t||0).getTime(),ne:L.indexOf('lang-ne')>-1,pair:(L.filter(function(x){return /^pair-/.test(x)})[0]||'')};
        byPath[p]=o;if(t)byTitle[t]=o;if(o.pair)(pairs[o.pair]=pairs[o.pair]||[]).push(o);
      });
      var TR=window.KAFKA_TRANSLATIONS||{},REC=window.KAFKA_RECORDINGS||{},MAN=res[1]||{};
      function mateOf(o){
        if(!o)return null;
        var pp=(window.KAFKA_PATH_PAIRS||{})[o.p];if(pp&&byPath[pp])return byPath[pp];
        if(o.pair&&pairs[o.pair]){var m=pairs[o.pair].filter(function(x){return x!==o})[0];if(m)return m}
        var tw=TR[o.t];if(tw&&byTitle[tw.other])return byTitle[tw.other];
        return null;
      }
      [].forEach.call(lists,function(ol){
        if(ol.dataset.k180)return;ol.dataset.k180='1';
        var lis=[].filter.call(ol.children,function(c){return c.tagName==='LI'});
        var info=lis.map(function(li){var a=li.querySelector('h2 a, a[href]');var p=a?np(a.getAttribute('href')):'';return {li:li,p:p,o:byPath[p]}});
        var inList={};info.forEach(function(x){inList[x.p]=x});
        info.forEach(function(x){
          if(!x.o||x.drop)return;
          var m=mateOf(x.o);if(!m||m.p===x.p)return;
          var isOrig=!(m.d&&x.o.d&&m.d<x.o.d);
          if(isOrig){x.tr=m;if(inList[m.p])inList[m.p].drop=true}
          else if(inList[m.p]){x.drop=true}
          else{x.tr=m}
        });
        info.forEach(function(x){if(x.drop&&x.li.parentNode)x.li.parentNode.removeChild(x.li)});
        var keep=info.filter(function(x){return !x.drop});
        keep.sort(function(a,b){return ((b.o&&b.o.d)||0)-((a.o&&a.o.d)||0)});
        keep.forEach(function(x,i){
          ol.appendChild(x.li);
          var nEl=x.li.querySelector('.kser-n');
          if(!nEl){nEl=document.createElement('span');nEl.className='kser-n kser-n2';x.li.insertBefore(nEl,x.li.firstChild)}
          nEl.textContent=i+1;
          if(x.li.querySelector('.kser-acts'))return;
          var a=x.li.querySelector('h2 a, a[href]');var href=a?a.getAttribute('href'):'';var title=a?a.textContent.trim():'';
          var acts=document.createElement('div');acts.className='kser-acts';
          var h='';
          /* v180: always offer listening (recording, or the browser voice until it is recorded) */
          h+='<a class="ka-ico ka-listen" href="'+esc(href)+'#klisten" aria-label="'+(x.o&&x.o.ne?'सुन्नुहोस्: ':'Listen: ')+esc(title)+'" title="'+(x.o&&x.o.ne?'सुन्नुहोस्':'Listen')+'">'+ICO.listen+'</a>';
          if(x.tr&&x.tr.p&&x.tr.p!==x.p){var toNe=x.tr.ne;h+='<a class="ka-ico ka-tr" href="'+esc(x.tr.p)+'" hreflang="'+(toNe?'ne':'en')+'" aria-label="'+(toNe?'नेपालीमा पढ्नुहोस्':'Read in English')+'" title="'+(toNe?'नेपालीमा पढ्नुहोस्':'Read in English')+'">'+ICO.tr+'<b>'+(toNe?'ने':'EN')+'</b></a>'}
          h+='<button type="button" class="ka-ico kact-share" data-url="'+esc(href)+'" data-title="'+esc(title)+'" aria-label="Share: '+esc(title)+'" title="Share">'+ICO.share+'</button>';
          acts.innerHTML=h;x.li.appendChild(acts);
        });
      });
    }).catch(function(){});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,60)});else setTimeout(run,60);
})();

/* v188: the post's own picture behind the current part in the series box, and behind each "More essays" card */
(function(){
  var KEY='kafka-thumbs-v2',map=null,pending=null;
  function norm(u){try{return new URL(u,location.href).pathname.replace(/\/+$/,'')}catch(e){return u}}
  function css(){
    if(document.getElementById('kbg-css'))return;
    var s=document.createElement('style');s.id='kbg-css';
    s.textContent=
      'html body .kser-hero li.is-cur>span.has-kbg{background-image:linear-gradient(180deg,rgba(25,25,24,.45) 0%,rgba(25,25,24,.85) 100%),var(--kbg)!important;background-size:cover!important;background-position:center!important}'+
      'html body .kmore-link.has-kbg{position:relative;min-height:150px;overflow:hidden;background-image:linear-gradient(180deg,rgba(25,25,24,.5) 0%,rgba(25,25,24,.9) 100%),var(--kbg)!important;background-size:cover!important;background-position:center!important;border-color:transparent!important}'+
      'html body .kmore-link.has-kbg>span:first-child{color:#fff!important;text-shadow:0 1px 8px rgba(0,0,0,.6)}'+
      'html body .kmore-link.has-kbg .kmore-arr{color:#fff!important}';
    document.head.appendChild(s);
  }
  function loadMap(){
    if(map)return Promise.resolve(map);
    try{var c=JSON.parse(sessionStorage.getItem(KEY)||'null');if(c&&c.m&&Date.now()-c.t<36e5){map=c.m;return Promise.resolve(map)}}catch(e){}
    if(pending)return pending;
    var m={};
    function page(si){return fetch('/feeds/posts/summary?alt=json&max-results=150&start-index='+si).then(function(r){return r.json()}).then(function(j){var es=(j.feed&&j.feed.entry)||[];es.forEach(function(e){var l=((e.link||[]).filter(function(x){return x.rel==='alternate'})[0]||{}).href;if(l&&e.media$thumbnail)m[norm(l)]=e.media$thumbnail.url.replace(/=s72(-w\d+)?(-h\d+)?(-c)?$/,'=w400').replace(/\/s72(-w\d+)?(-h\d+)?(-c)?\//,'/s400/')});return {n:es.length,total:+((j.feed.openSearch$totalResults||{}).$t||0)}})}
    function all(si){return page(si).then(function(r){var nx=si+r.n;return(r.n&&nx<=r.total&&nx<400)?all(nx):0})}
    pending=all(1).then(function(){map=m;try{sessionStorage.setItem(KEY,JSON.stringify({t:Date.now(),m:m}))}catch(e){}return m}).catch(function(){return m});
    return pending;
  }
  function paint(el,url){url=String(url);if(window.kTiny)url=kTiny(url,el.matches('.kmore-link,.kser-hero span')?240:96);el.style.setProperty('--kbg','url("'+url.replace(/"/g,'%22')+'")');el.classList.add('has-kbg')}
  function run(){
    var cur=document.querySelector('.kser-hero li.is-cur>span:not(.has-kbg)');
    var og=document.querySelector('meta[property="og:image"]');
    if(cur&&og&&og.content){css();paint(cur,og.content.replace(/=w\d+(-[a-z0-9-]+)?$/,'=w600'))}
    var links=[].slice.call(document.querySelectorAll('.kmore-link:not(.has-kbg)'));
    if(links.length){css();loadMap().then(function(m){links.forEach(function(a){var u=m[norm(a.getAttribute('href'))];if(u)paint(a,u)})})}
  }
  function start(){run();if(!window.MutationObserver)return;var t=0,mo=new MutationObserver(function(){if(t)return;t=setTimeout(function(){t=0;run()},200)});mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){mo.disconnect()},20000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

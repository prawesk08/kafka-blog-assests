/* kafka-collections.js v2
   1. gives each list block (ol.klist, ol.kser-items rows, article.kcard) its featured photo as --kbg, for the blurred photo canvas
   2. series carousel cards on post pages (.kser-deck .kser-card) get --kbg the same way
   3. post header: Share (opens on tap), Listen and the बासभ follow box in one row of one panel
   4. Photos page: numbered section heads, captions on the prints, lightbox
   5. About page: portrait card, lead, pull quote, topic cards, callouts
   6. post rows (ol.kser-items on category/series/literature pages, article.kcard on home/label/search pages):
      moves the number out of the photo into its own column, splits "Title: Subtitle" so the two get different type,
      and marks Devanagari titles/subtitles with .kt-ne (the li lang attribute is not reliable) */
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
  var DEV=/[ऀ-ॿ]/;
  function paint(root){
    [].forEach.call((root||document).querySelectorAll('ol.klist>li, ol.kser-items>li, article.kcard'),function(el){
      if(el.getAttribute('data-kbg'))return; var img=el.querySelector('img'); if(!img)return;
      var src=img.currentSrc||img.getAttribute('src'); if(!src||/^data:/.test(src))return;
      var v='url("'+kTiny(src).replace(/"/g,'%22')+'")'; el.style.setProperty('--kbg',v); el.setAttribute('data-kbg','1');
      var pic=el.querySelector('a.pic'); if(pic)pic.style.setProperty('--kbg',v);
    });
  }
  /* series carousel cards on post pages: tint from the card's own photo */
  function deck(root){
    [].forEach.call((root||document).querySelectorAll('.kser-deck .kser-card'),function(c){
      if(c.getAttribute('data-kbg'))return; var img=c.querySelector('.kser-thumb img'); if(!img)return;
      var src=img.currentSrc||img.getAttribute('src'); if(!src||/^data:/.test(src))return;
      c.style.setProperty('--kbg','url("'+kTiny(src).replace(/"/g,'%22')+'")'); c.setAttribute('data-kbg','1');
    });
  }
  function split(a){
    if(!a||a.getAttribute('data-ksplit'))return null; a.setAttribute('data-ksplit','1');
    var m=a.textContent.match(/^(.{6,}?)\s*[:：]\s+(.{4,})$/);
    if(!m)return null; a.textContent=m[1]; return m[2];
  }
  function rows(root){
    [].forEach.call((root||document).querySelectorAll('ol.kser-items>li'),function(li){
      if(li.getAttribute('data-krow'))return; li.setAttribute('data-krow','1');
      var n=li.querySelector('.kser-pic .kser-n'); if(n)li.insertBefore(n,li.firstChild);
      var h=li.querySelector(':scope>h2'), a=h&&h.querySelector('a');
      if(a&&DEV.test(a.textContent))li.classList.add('kt-ne');
      var sub=split(a), p;
      if(sub){p=document.createElement('p');p.className='kt-sub';p.textContent=sub;h.parentNode.insertBefore(p,h.nextSibling)}
      else{p=li.querySelector(':scope>p:not(.kser-date)');if(p)p.classList.add('kt-sub','kt-dek');else li.classList.add('kt-nosub')}
      if(p&&DEV.test(p.textContent))p.classList.add('kt-ne');
    });
    [].forEach.call((root||document).querySelectorAll('article.kcard'),function(c){
      if(c.getAttribute('data-krow'))return; c.setAttribute('data-krow','1');
      var a=c.querySelector('h3 a'); if(a&&DEV.test(a.textContent))c.classList.add('kt-ne');
      var sub=split(a);
      if(sub){var s=document.createElement('span');s.className='kt-sub';if(DEV.test(sub))s.classList.add('kt-ne');s.textContent=sub;a.parentNode.parentNode.insertBefore(s,a.parentNode.nextSibling)}
      else c.classList.add('kt-nosub');
    });
  }
  /* post header: Share, Listen and Follow in one row of one panel; Share shows its icons only when tapped */
  function onerow(){
    var head=document.querySelector('header.post-head'); if(!head)return;
    var row=head.querySelector('.klrow'), sh=head.querySelector('.kshare.top'); if(!row||!sh)return;
    if(sh.parentNode!==row){row.insertBefore(sh,row.firstChild);row.classList.add('k1row');}
    var kf=row.querySelector('.kfollow');if(kf&&!kf.querySelector('.kf-face')){var f=document.createElement('img');f.className='kf-face';f.alt='';f.width=34;f.height=34;f.loading='lazy';f.src='https://assets.kafka.blog/basava-priest-king-160.jpg';kf.insertBefore(f,kf.firstChild)}
    var lbl=sh.querySelector('.lbl'); if(!lbl||lbl.getAttribute('data-k1'))return; lbl.setAttribute('data-k1','1');
    lbl.setAttribute('role','button');lbl.setAttribute('tabindex','0');lbl.setAttribute('aria-expanded','false');
    function set(o){sh.classList.toggle('is-open',o);lbl.setAttribute('aria-expanded',o?'true':'false')}
    lbl.addEventListener('click',function(e){e.preventDefault();set(!sh.classList.contains('is-open'))});
    lbl.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();set(!sh.classList.contains('is-open'))}});
    document.addEventListener('click',function(e){if(!sh.contains(e.target))set(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
  }




  /* softer red sitewide: solid maroon fills (#7B2D26: buttons, badges, pills, the player) become a lighter terracotta, solid maroon borders a dusty rose.
     The colour is set in many stylesheets and scripts, so this finds the painted elements once each and overrides them inline. */
  var SOFT_BG='#a8665b', SOFT_BD='#c08d84', seen=window.WeakSet?new WeakSet():null;
  function soften(){
    if(!seen)return;
    /* wait for this file's stylesheet, so elements it restyles (e.g. the plain-text name) are not painted */
    if(getComputedStyle(document.documentElement).getPropertyValue('--red').trim().toLowerCase()!=='#9a5047')return;
    [].forEach.call(document.querySelectorAll('button,a,span,i,b,label,input,div.ksh-cnt,form'),function(e){
      if(seen.has(e))return; seen.add(e); if(e.closest('.kl-voice,[aria-pressed],[role=tab],.tabs-items,.kfollow .kf-top'))return; var s=getComputedStyle(e);
      if(s.backgroundColor==='rgb(123, 45, 38)')e.style.setProperty('background-color',SOFT_BG,'important');
      if(s.borderTopColor==='rgb(123, 45, 38)'&&parseFloat(s.borderTopWidth)>0)e.style.setProperty('border-color',SOFT_BD,'important');
    });
  }
  /* series box at the top of a post: give each part link the photo of the same part from the carousel lower down */
  function heroTint(){
    var nav=document.querySelector('nav.kser-hero'); if(!nav)return; var map={};
    [].forEach.call(document.querySelectorAll('.kser-deck a.kser-card'),function(c){var img=c.querySelector('.kser-thumb img');if(img)map[c.getAttribute('href').replace(/^https?:\/\/[^\/]+/,'').split(/[?#]/)[0]]=img.getAttribute('src')});
    [].forEach.call(nav.querySelectorAll('ol>li>a'),function(a){
      if(a.classList.contains('has-kbg'))return; var src=map[a.getAttribute('href').replace(/^https?:\/\/[^\/]+/,'').split(/[?#]/)[0]]; if(!src)return;
      a.style.setProperty('--kbg','url("'+kTiny(src).replace(/"/g,'%22')+'")'); a.classList.add('has-kbg');
    });
  }
  /* Photos page: stretch the last photo of each section to the end of its row, so a section never ends with a hole */
  function fillEnds(){
    [].forEach.call(document.querySelectorAll('.kphotos .kgrid'),function(g){
      var last=g.lastElementChild; if(!last)return; last.style.gridColumnEnd='';
      var cols=getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length; if(cols<2)return;
      var gr=g.getBoundingClientRect(), lr=last.getBoundingClientRect();
      if(gr.right-lr.right>40){last.style.gridColumnEnd='-1';}
      /* any other photo ending the final row early */
    });
  }
  var fe=0; window.addEventListener('resize',function(){clearTimeout(fe);fe=setTimeout(fillEnds,150)});
  /* Photos page: numbered section heads with counts, a caption on each print, and a lightbox */
  function gallery(){
    var root=document.querySelector('.kphotos'); if(!root||root.getAttribute('data-kg'))return; root.setAttribute('data-kg','1'); document.documentElement.classList.add('k-photos-page');
    var ROM=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'], all=[];
    [].forEach.call(root.querySelectorAll('h2'),function(h,i){
      var g=h.nextElementSibling; while(g&&!g.classList.contains('kgrid'))g=g.nextElementSibling;
      var n=g?g.querySelectorAll('a').length:0;
      h.setAttribute('data-kn',ROM[i]||String(i+1)); h.setAttribute('data-kc',n+(n===1?' photograph':' photographs'));
      /* each section scrolls sideways; arrows on the heading move it one screen at a time */
      if(g&&n>3&&!h.querySelector('.kg-nav')){
        var nav=document.createElement('span'); nav.className='kg-nav';
        [['‹','Previous photos',-1],['›','More photos',1]].forEach(function(d){
          var b=document.createElement('button'); b.type='button'; b.textContent=d[0]; b.setAttribute('aria-label',d[1]);
          b.addEventListener('click',function(){g.scrollBy({left:d[2]*Math.max(200,g.clientWidth*.8),behavior:'smooth'})});
          nav.appendChild(b);
        });
        h.appendChild(nav);
      }
    });
    [].forEach.call(root.querySelectorAll('.kgrid>a'),function(a){
      var img=a.querySelector('img'); if(!img)return; var k=all.length;
      a.setAttribute('data-cap',img.getAttribute('alt')||''); a.setAttribute('data-no','Nº '+(k+1<10?'0':'')+(k+1));
      all.push({src:a.getAttribute('href'),cap:img.getAttribute('alt')||''});
      a.addEventListener('click',function(e){if(e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();open(k)});
    });
    fillEnds(); window.addEventListener('load',fillEnds);
    var box,im,cap,cur=0,tx=null;
    function show(i){cur=(i+all.length)%all.length;im.src=all[cur].src;im.alt=all[cur].cap;cap.innerHTML='';var b=document.createElement('b');b.textContent='Nº '+(cur+1)+' / '+all.length;cap.appendChild(b);cap.appendChild(document.createTextNode(all[cur].cap))}
    function close(){if(!box)return;box.classList.remove('on');document.documentElement.style.overflow='';var b=box;box=null;setTimeout(function(){b.remove()},200);document.removeEventListener('keydown',key)}
    function key(e){if(e.key==='Escape')close();else if(e.key==='ArrowRight')show(cur+1);else if(e.key==='ArrowLeft')show(cur-1)}
    function btn(c,t,f){var b=document.createElement('button');b.type='button';b.className=c;b.setAttribute('aria-label',t);b.textContent=c==='klb-x'?'×':(c==='klb-p'?'‹':'›');b.addEventListener('click',function(e){e.stopPropagation();f()});return b}
    function open(i){
      box=document.createElement('div');box.className='klb';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');
      im=document.createElement('img');cap=document.createElement('p');cap.className='klb-cap';
      box.appendChild(im);box.appendChild(cap);
      box.appendChild(btn('klb-x','Close',close));box.appendChild(btn('klb-p','Previous',function(){show(cur-1)}));box.appendChild(btn('klb-n','Next',function(){show(cur+1)}));
      box.addEventListener('click',function(e){if(e.target===box)close()});
      box.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
      box.addEventListener('touchend',function(e){if(tx===null)return;var d=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(d)>40)show(cur+(d<0?1:-1))});
      document.body.appendChild(box);document.documentElement.style.overflow='hidden';document.addEventListener('keydown',key);
      show(i);requestAnimationFrame(function(){box&&box.classList.add('on')});
    }
  }
  /* About page: portrait card, lead paragraph, pull quote, topic cards and callouts, built from the page's own text */
  function about(){
    var ab=document.querySelector('.kafka-about'); if(!ab||ab.classList.contains('kab'))return; ab.classList.add('kab');
    var IC={sci:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/></svg>',
      his:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M4 10h16M12 3 3 8h18z"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8"/></svg>',
      lit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-6 0-11 5-12 12l-2 4"/><path d="M8 16c4 0 8-2 10-6"/></svg>',
      pho:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>'};
    var LINK={sci:'/p/science.html',his:'/p/history.html',lit:'/p/literature.html',pho:'/p/photos.html'};
    [].forEach.call(ab.querySelectorAll(':scope>p'),function(p){if(!p.textContent.replace(/ /g,'').trim()&&!p.querySelector('img'))p.classList.add('kab-blank')});
    var ps=ab.querySelectorAll(':scope>p:not(.kab-blank)');
    /* hero card */
    var hero=document.createElement('div');hero.className='kab-hero';
    hero.innerHTML='<img class="kab-face" alt="बासभ (Basava)" src="https://assets.kafka.blog/basava-priest-king-160.jpg"><div><h2 class="kab-name">बासभ <span>Basava, writing as @naharchowck</span></h2><div class="kab-roles"><span>Immunotherapy</span><span>Molecular biology</span><span>Occasional writer</span><span>Occasional photographer</span></div><div class="kab-so"></div></div>';
    var so=hero.querySelector('.kab-so');
    [].forEach.call(ab.querySelectorAll('.kel a.kel-so'),function(a){var c=a.cloneNode(true);c.className='';var i=c.querySelector('i');if(i)i.remove();so.appendChild(c)});
    ab.insertBefore(hero,ab.firstChild);
    if(ps[0])ps[0].classList.add('kab-lead');
    /* pull quote from the childhood paragraph */
    if(ps[1]){var m=ps[1].textContent.match(/Muna Madan[^.;]*;\s*Parijat[^.]*\./);if(m){var q=document.createElement('blockquote');q.className='kab-pull';q.textContent=m[0];ps[1].parentNode.insertBefore(q,ps[1].nextSibling)}}
    /* topic cards */
    var ul=ab.querySelector(':scope>ul');
    if(ul){var grid=document.createElement('div');grid.className='kab-topics';
      [].forEach.call(ul.querySelectorAll(':scope>li'),function(li){
        var b=li.querySelector('b'); if(!b)return; var t=b.textContent.replace(/[-–—\s]+$/,'').trim();
        var k=/^Sci/i.test(t)?'sci':/^Hist/i.test(t)?'his':/^Photo/i.test(t)?'pho':'lit';
        var card=document.createElement('div');card.className='kab-topic';
        var ic=document.createElement('span');ic.className='kab-ic';ic.innerHTML=IC[k];
        var body=document.createElement('div');var h=document.createElement('h3');var a=document.createElement('a');a.href=LINK[k];a.textContent=t;h.appendChild(a);
        var p=document.createElement('p');var c=li.cloneNode(true);var cb=c.querySelector('b');if(cb)cb.remove();p.innerHTML=c.innerHTML.replace(/^(\s|&nbsp;)+/,'');
        body.appendChild(h);body.appendChild(p);card.appendChild(ic);card.appendChild(body);grid.appendChild(card);
      });
      ul.parentNode.replaceChild(grid,ul);}
    /* callouts */
    [].forEach.call(ab.querySelectorAll(':scope>p'),function(p){var s=p.textContent;if(/press\s+Listen/i.test(s))p.classList.add('kab-note');else if(/Subscribe/.test(s)&&/inbox/.test(s)){p.classList.add('kab-note');p.classList.add('kab-mail')}});
    /* "Why" section as a dark card with the Kafka line on top */
    var hs=ab.querySelectorAll(':scope>h2'), last=hs[hs.length-1];
    if(last&&/Kafka/i.test(last.textContent)){var wp=last.nextElementSibling;if(wp&&wp.tagName==='P'){var card=document.createElement('div');card.className='kab-why';wp.parentNode.insertBefore(card,wp);card.appendChild(wp)}}
  }
  /* Nepali danda: drop the space typed before । and ॥ (बासभ । -> बासभ।) */
  var DR=/[ \u00a0\u2009\u200a\u202f]+([\u0964\u0965])/g,DS=/^[\u0964\u0965]/,DE=/[ \u00a0\u2009\u200a\u202f]+$/;
  function danda(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;return p&&/^(SCRIPT|STYLE|TEXTAREA|CODE|PRE)$/.test(p.nodeName)||p.isContentEditable?2:1}}),n,prev=null,v;
    while((n=w.nextNode())){v=n.nodeValue;if(v.indexOf('\u0964')>-1||v.indexOf('\u0965')>-1){if(DR.test(v)){DR.lastIndex=0;n.nodeValue=v=v.replace(DR,'$1')}DR.lastIndex=0;if(prev&&DS.test(v)&&DE.test(prev.nodeValue))prev.nodeValue=prev.nodeValue.replace(DE,'')}if(/\S/.test(v))prev=n}}
  /* A short line typed right under a photo is its caption: centre it with the photo */
  function caps(){[].forEach.call(document.querySelectorAll('article.prose>p,.post-body>p'),function(p){if(p.getAttribute('data-kcap'))return;var im=p.querySelector('img');if(!im||p.textContent.trim()!=='')return;p.setAttribute('data-kcap','1');var w=+im.getAttribute('width')||im.naturalWidth||0;if(w&&w<200)return;var n=p.nextElementSibling;while(n&&n.tagName==='P'&&!n.textContent.trim()&&!n.querySelector('img'))n=n.nextElementSibling;if(!n||n.tagName!=='P'||n.querySelector('img'))return;var t=n.textContent.trim();if(t.length<3||t.length>140)return;p.classList.add('k-hascap');n.classList.add('k-cap');if(/[\u0900-\u097F]/.test(t))n.classList.add('kt-ne')})}
  /* sidebar Lists: a short note beside each list (edit the lines here) */
  var LNOTE={books:'The ones I go back to, not the ones I finished.',movies:'Films that stayed after the credits.',photos:'Small moments I did not want to lose.',series:'What I watch when the writing stops.',songs:'Whatever will not leave my head this month.'};
  function listNotes(){[].forEach.call(document.querySelectorAll('nav.box.lists>a'),function(a){if(a.querySelector('.kl-c'))return;var m=(a.getAttribute('href')||'').match(/\/p\/(\w+)\.html/);var n=m&&LNOTE[m[1]];if(!n)return;var c=document.createElement('span');c.className='kl-c';c.textContent=n;a.appendChild(c)})}
  /* tag strip: let a mouse wheel scroll it sideways */
  function tagWheel(){var k=document.querySelector('.ktagstrip .ktags');if(!k||k.getAttribute('data-kw'))return;k.setAttribute('data-kw','1');k.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&k.scrollWidth>k.clientWidth){var max=k.scrollWidth-k.clientWidth;if((e.deltaY>0&&k.scrollLeft<max)||(e.deltaY<0&&k.scrollLeft>0)){k.scrollLeft+=e.deltaY;e.preventDefault()}}},{passive:false})}
  /* series list: copy the piece count into data-n so CSS can show it as a tile */
  function serCounts(){[].forEach.call(document.querySelectorAll('.kserlist a.kser-row>.cnt:not([data-n])'),function(c){var m=c.textContent.match(/\d+/);c.setAttribute('data-n',m?m[0]:'')})}
  /* homepage start rows: copy each row's photo into --kbg for the tinted canvas */
  function startTint(){[].forEach.call(document.querySelectorAll('.kstart5>a.k5:not([data-kt]),.k3col>a.k5:not([data-kt])'),function(a){var s=a.querySelector('.k5-img');var m=s&&(s.getAttribute('style')||'').match(/url\((['"]?)(.*?)\1\)/);if(!m)return;a.setAttribute('data-kt','1');a.style.setProperty('--kbg','url("'+kTiny(m[2]).replace(/"/g,'%22')+'")')})}
  /* homepage start rows: add the opening line of each post (from the summary feed) on the right */
  var subFeed=null;
  function startSubs(){var rows=document.querySelectorAll('.kstart5>a.k5:not([data-ks])');if(!rows.length||!window.fetch)return;[].forEach.call(rows,function(a){a.setAttribute('data-ks','1')});
    if(!subFeed)subFeed=fetch('/feeds/posts/summary?alt=json&max-results=25').then(function(r){return r.json()}).then(function(j){var m={};(j.feed.entry||[]).forEach(function(e){var l=(e.link||[]).filter(function(x){return x.rel==='alternate'})[0];if(l)m[l.href.replace(/^https?:\/\/[^\/]+/,'')]=((e.summary&&e.summary.$t)||'').replace(/\s+/g,' ').trim()});return m}).catch(function(){return {}});
    subFeed.then(function(m){[].forEach.call(rows,function(a){if(a.querySelector('.k5-s'))return;var s=m[a.getAttribute('href').replace(/^https?:\/\/[^\/]+/,'').split(/[?#]/)[0]];if(!s)return;var cut=s.match(/^(.{40,160}?[.।?!])(\s|$)/);s=cut?cut[1]:(s.length>150?s.slice(0,150).replace(/\s+\S*$/,'')+'…':s);var sp=document.createElement('span');sp.className='k5-s'+(/[\u0900-\u097F]/.test(s)?' kt-ne':'');sp.textContent=s;a.appendChild(sp)});danda()})}
  /* pinned-series part cards: small photo + tinted canvas from the feed thumbnail */
  var thFeed=null;
  function partThumbs(){[].forEach.call(document.querySelectorAll('article.kps:not([data-kt])'),function(k){var im=k.querySelector('.kps-pic img');var u=im&&(im.currentSrc||im.src);if(!u)return;k.setAttribute('data-kt','1');k.style.setProperty('--kbg','url("'+kTiny(u).replace(/"/g,'%22')+'")')});var lis=document.querySelectorAll('ol.kps-parts>li:not([data-kt])');if(!lis.length||!window.fetch)return;[].forEach.call(lis,function(li){li.setAttribute('data-kt','1')});
    if(!thFeed)thFeed=fetch('/feeds/posts/summary?alt=json&max-results=60').then(function(r){return r.json()}).then(function(j){var m={};(j.feed.entry||[]).forEach(function(e){var l=(e.link||[]).filter(function(x){return x.rel==='alternate'})[0];var t=e.media$thumbnail&&e.media$thumbnail.url;if(l&&t)m[l.href.replace(/^https?:\/\/[^\/]+/,'')]=t.replace(/\/s72(-[a-z])?\//,'/w320/').replace(/=s72[^\/]*$/,'=w320')});return m}).catch(function(){return {}});
    thFeed.then(function(m){[].forEach.call(lis,function(li){var a=li.querySelector('a.tt');if(!a||li.querySelector('.kps-th'))return;var u=m[a.getAttribute('href').replace(/^https?:\/\/[^\/]+/,'').split(/[?#]/)[0]];if(!u)return;var th=document.createElement('a');th.className='kps-th';th.href=a.href;th.setAttribute('aria-hidden','true');th.tabIndex=-1;var im=document.createElement('img');im.loading='lazy';im.alt='';im.src=u;th.appendChild(im);li.insertBefore(th,li.firstChild);li.style.setProperty('--kbg','url("'+kTiny(u).replace(/"/g,'%22')+'")')})})}
  /* homepage feature cards: photo into --kbg for the tinted canvas */
  function homeTint(){[].forEach.call(document.querySelectorAll('#kafka-home article.plane.pinned:not([data-kt]),#kafka-home .wheel-plane article.mini:not([data-kt]),#kafka-home .sq-grid article.sq:not([data-kt])'),function(a){var p=a.querySelector('a.pic');var m=p&&(p.getAttribute('style')||'').match(/--pic-bg:\s*url\((&quot;|["']?)(.*?)\1\)/);var src=m?m[2]:((p&&p.querySelector('img'))||{}).currentSrc;if(!src)return;a.setAttribute('data-kt','1');a.style.setProperty('--kbg','url("'+kTiny(src).replace(/"/g,'%22')+'")')})}
  /* List order: series pages start at part 1 (positions from the page's ItemList data); list, category and label pages get numbers and a switch between the two directions */
  function order(){
    var art=document.querySelector('.static-page'), groups=[], series=false, pos=null, host=null, off=0;
    if(art){
      [].forEach.call(art.querySelectorAll('ol.kser-items'),function(o){if(o.children.length>1)groups.push({box:o,items:[].slice.call(o.children)})});
      try{[].some.call(document.querySelectorAll('script[type="application/ld+json"]'),function(sc){if(!/ItemList/.test(sc.textContent))return false;var j=JSON.parse(sc.textContent);if(!j.itemListElement)return false;pos={};j.itemListElement.forEach(function(e){try{pos[new URL(e.url).pathname.replace(/\/+$/,'')]=e.position}catch(x){}});return true})}catch(x){pos=null}
      series=!!pos||/reading order/.test((art.querySelector('.page-meta')||{}).textContent||'');
      host=art.querySelector('.page-meta')||art.querySelector('.kser-tabs')||(groups[0]&&groups[0].box);
    }else if(/^\/search/.test(location.pathname)){
      var w=document.querySelector('.widget.Blog'); if(!w)return;
      var cs=[].filter.call(w.children,function(c){return c.matches&&c.matches('article.kcard')}); if(cs.length<2)return;
      groups.push({box:w,items:cs,cards:1}); host=w.querySelector('.list-head');
      try{off=+sessionStorage.getItem('kafka-off:'+location.href)||0}catch(x){}
      var pg=document.querySelector('.blog-pager-older-link,a#Blog1_blog-pager-older-link');
      if(pg&&!pg.getAttribute('data-koff')){pg.setAttribute('data-koff','1');pg.addEventListener('click',function(){try{sessionStorage.setItem('kafka-off:'+pg.href,off+cs.length)}catch(x){}})}
    }
    if(!groups.length)return;
    function rank(li){var best=1e9;[].forEach.call(li.querySelectorAll('a[href]'),function(a){try{var p=pos[new URL(a.href,location.href).pathname.replace(/\/+$/,'')];if(p&&p<best)best=p}catch(x){}});return best}
    groups.forEach(function(g){
      var box=g.box, lis=g.items;
      if(box.getAttribute('data-kbase')===String(lis.length))return;
      if(!box.__kend){box.__kend=document.createComment('kord');var last=lis[lis.length-1];last.parentNode.insertBefore(box.__kend,last.nextSibling)}
      if(pos&&!box.getAttribute('data-kbase')){var ix=lis.map(function(li,i){return [rank(li),i,li]});ix.sort(function(a,b){return a[0]-b[0]||a[1]-b[1]});lis=ix.map(function(x){return x[2]});lis.forEach(function(li){box.__kend.parentNode.insertBefore(li,box.__kend)})}
      lis.forEach(function(li,i){li.setAttribute('data-kidx',i);
        if(g.cards&&!li.querySelector(':scope>.kc-n')){var n=document.createElement('span');n.className='kc-n';n.textContent=off+i+1;li.insertBefore(n,li.firstChild)}});
      box.setAttribute('data-kbase',lis.length); box.removeAttribute('data-kdir');
    });
    var key='kafka-order-'+(series?'series':'list'), dir=null; try{dir=localStorage.getItem(key)}catch(x){}
    if(dir!=='rev')dir='base';
    var root=art||document.querySelector('.widget.Blog'), bar=root.querySelector('.kord');
    if(!bar&&host){
      bar=document.createElement('div'); bar.className='kord'; bar.setAttribute('role','group'); bar.setAttribute('aria-label','Order');
      var L=series?[['rev','Latest part first'],['base','Part 1 first']]:[['base','Newest first'],['rev','Oldest first']];
      L.forEach(function(x){var b=document.createElement('button');b.type='button';b.setAttribute('data-dir',x[0]);b.textContent=x[1];b.addEventListener('click',function(){try{localStorage.setItem(key,x[0])}catch(e){}order()});bar.appendChild(b)});
      if(host.classList.contains('kser-tabs')||host.tagName==='OL')host.parentNode.insertBefore(bar,host); else host.insertAdjacentElement('afterend',bar);
    }
    if(bar)[].forEach.call(bar.children,function(b){b.setAttribute('aria-pressed',b.getAttribute('data-dir')===dir?'true':'false')});
    groups.forEach(function(g){
      var box=g.box;
      if(pos)g.items.forEach(function(li){var k=String(+li.getAttribute('data-kidx')+1);[].forEach.call(li.querySelectorAll('.kser-n'),function(n){if(n.textContent!==k)n.textContent=k})});
      if(box.getAttribute('data-kdir')===dir)return; box.setAttribute('data-kdir',dir);
      var lis=g.items.slice().sort(function(a,b){var x=+a.getAttribute('data-kidx'),y=+b.getAttribute('data-kidx');return dir==='rev'?y-x:x-y});
      lis.forEach(function(li){box.__kend.parentNode.insertBefore(li,box.__kend)});
    });
  }
  /* Books, Movies, Series, Songs: each shelf becomes one sideways strip, with arrows on its heading */
  function shelves(){
    [].forEach.call(document.querySelectorAll('.kafka-list'),function(L){
      if(L.getAttribute('data-kstrip'))return;
      var kids=[].slice.call(L.children); if(!kids.some(function(k){return k.classList.contains('kafka-item')}))return;
      L.setAttribute('data-kstrip','1'); if(L.closest('.static-page'))document.documentElement.classList.add('k-photos-page','k-shelf-page');
      var head=null, strip=null;
      kids.forEach(function(k){
        if(k.classList.contains('kafka-list-shelf')){head=k;strip=null;return}
        if(!k.classList.contains('kafka-item')){strip=null;return}
        if(!strip){strip=document.createElement('div');strip.className='kshelf-strip';k.parentNode.insertBefore(strip,k);
          if(head&&!head.querySelector('.kg-nav')){(function(st){var nav=document.createElement('span');nav.className='kg-nav';
            [['‹','Previous',-1],['›','More',1]].forEach(function(d){var b=document.createElement('button');b.type='button';b.textContent=d[0];b.setAttribute('aria-label',d[1]);b.addEventListener('click',function(){st.scrollBy({left:d[2]*Math.max(200,st.clientWidth*.8),behavior:'smooth'})});nav.appendChild(b)});
            head.appendChild(nav);function fit(){nav.style.visibility=st.scrollWidth>st.clientWidth+4?'':'hidden'}setTimeout(fit,300);window.addEventListener('resize',fit);window.addEventListener('load',fit)})(strip)}}
        strip.appendChild(k);
        var im=k.querySelector('.kt-art img'); if(im&&!k.style.getPropertyValue('--kbg'))k.style.setProperty('--kbg','url("'+kTiny(im.currentSrc||im.src).replace(/"/g,'%22')+'")');
      });
    });
  }
  /* v8: line rows up across the homepage's three-column blocks, and keep the section doors even */
  function kTop(e){return e.getBoundingClientRect().top}
  function kH(e){return e?e.getBoundingClientRect().height:0}
  function kOneCol(cols){var xs=cols.filter(function(c){return c.length}).map(function(c){return Math.round(c[0].getBoundingClientRect().left)});return xs.length<2||xs.every(function(x){return x===xs[0]})}
  /* sizes go into one generated stylesheet (nth-child paths), so scripts that rewrite a row's style attribute or rebuild it can't undo them */
  var kSheet=null,kRules=[];
  function kPath(e,stop){var p=[];while(e&&e!==stop&&e.parentElement){var i=Array.prototype.indexOf.call(e.parentElement.children,e)+1;p.unshift(e.tagName.toLowerCase()+':nth-child('+i+')');e=e.parentElement}return stop.className.split(/\s+/).filter(Boolean).map(function(c){return '.'+c}).join('').replace(/^/,'html body ')+'>'+p.join('>')}
  function kRule(e,root,decl,tail){kRules.push(kPath(e,root)+(tail||'')+'{'+decl+'}')}
  function kFlush(){if(!kSheet){kSheet=document.createElement('style');kSheet.id='k-even-rows';document.head.appendChild(kSheet)}var t=kRules.join('\n');if(kSheet.textContent!==t)kSheet.textContent=t}
  function kSet(cols,H,root){cols.forEach(function(c){c.forEach(function(e,i){if(e&&H[i]>kH(e)+0.5){kRule(e,root,'min-height:'+H[i].toFixed(2)+'px!important');kRule(e,root,'align-self:stretch!important;justify-content:space-between!important','>.k5-b')}})})}
  function rowSync(){
    kRules=[];if(kSheet)kSheet.textContent='';
    if(window.innerWidth<=700){kFlush();return}
    var k3=document.querySelector('.kstart3');
    if(k3){var c3=Array.prototype.map.call(k3.querySelectorAll(':scope>.k3col'),function(c){return Array.prototype.slice.call(c.querySelectorAll(':scope>.k5'))});
      if(!kOneCol(c3)){var n3=Math.max.apply(null,c3.map(function(c){return c.length})),H3=[];for(var i=0;i<n3;i++){H3[i]=0;c3.forEach(function(c){H3[i]=Math.max(H3[i],kH(c[i]))})}kSet(c3,H3,k3)}}
    var th=document.querySelector('.three'),cs=th?th.querySelectorAll(':scope>.col'):[];
    if(cs.length===3){
      var L=Array.prototype.slice.call(cs[0].querySelectorAll('ol.klist>li')),R=Array.prototype.slice.call(cs[2].querySelectorAll('ol.klist>li'));
      var S=Array.prototype.slice.call(cs[1].querySelectorAll('.kserlist>.kser-row')),A=cs[1].querySelector('.karchive'),Y=A?Array.prototype.slice.call(A.querySelectorAll(':scope>.ka-year')):[],list=cs[1].querySelector('.kserlist');
      if(L.length&&R.length&&!kOneCol([L,R])){
        /* the side columns set the block's height; the middle column fits itself to their rows */
        kRule(cs[1],th,'contain:size!important');kFlush();
        var n=Math.max(L.length,R.length),off=n-S.length,mid=off>=1&&S.length&&A&&A.classList.contains('folded')&&Y.length;
        var H=[];for(var j=0;j<n;j++)H[j]=Math.max(kH(L[j]),kH(R[j]));
        kSet([L,R],H,th);kFlush();
        if(mid){
          S.forEach(function(e,i){var h=kH(L[i+off]).toFixed(2);kRule(e,th,'height:'+h+'px!important;min-height:'+h+'px!important')});
          var ah=Math.max(40,L[off-1].getBoundingClientRect().bottom-kTop(L[0]));
          kRule(A,th,'display:flex!important;flex-direction:column!important;height:'+ah.toFixed(2)+'px!important');
          Y.forEach(function(y){kRule(y,th,'min-height:0!important;height:'+(ah/Y.length).toFixed(2)+'px!important')});
          kFlush();
          if(list){var m=0,base=kRules.length;for(var k=0;k<3;k++){var d=kTop(L[off])-kTop(S[0]);if(Math.abs(d)<0.5)break;m+=d;kRules.length=base;kRule(list,th,'margin-top:'+m.toFixed(2)+'px!important');kFlush()}}
        }
      }
    }
    kFlush();
  }
  function doorsEven(){
    var g=document.querySelector('.kd-grid');if(!g)return;g.classList.remove('kd-stack');
    var wrap=Array.prototype.some.call(g.querySelectorAll('.kd-door'),function(d){var a=d.querySelector('.kd-ne'),b=d.querySelector('.kd-en');return a&&b&&b.offsetTop>a.offsetTop+4});
    if(wrap)g.classList.add('kd-stack');
  }
  var kRS=0,kRO=null,kSeen=[];function evenUp(){if(kRS)clearTimeout(kRS);kRS=setTimeout(function(){kRS=0;try{doorsEven();rowSync();kWatch()}catch(e){}},40)}
  function kWatch(){if(!window.ResizeObserver)return;if(!kRO)kRO=new ResizeObserver(function(){evenUp()});
    Array.prototype.forEach.call(document.querySelectorAll('.kstart3>.k3col .k5-t,.three ol.klist>li .kl-t,.three ol.klist>li>div,.kd-door'),function(e){if(kSeen.indexOf(e)<0){kSeen.push(e);kRO.observe(e)}});
    kSeen=kSeen.filter(function(e){if(document.contains(e))return true;kRO.unobserve(e);return false})}
  window.addEventListener('resize',evenUp);window.addEventListener('load',evenUp);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(evenUp);
  /* v8: in list rows the share button becomes a film button; faded until that post has a film */
  var kFilms=null,kFilmP=null;
  function kFilmList(){if(!kFilmP)kFilmP=Promise.all(['https://audio.kafka.blog/video-manifest.json','https://assets.kafka.blog/video-captions.json'].map(function(u){return fetch(u).then(function(r){return r.ok?r.json():null}).catch(function(){return null})})).then(function(r){var m={};r.forEach(function(j){if(j&&j.videos)Object.keys(j.videos).forEach(function(k){if(j.videos[k]&&(j.videos[k].src||j===r[0]))m[k]=1})});/* v11: R2 manifest is flat since 2026-11-27 */if(r[0]&&!r[0].videos)Object.keys(r[0]).forEach(function(k){if(k.charAt(0)==='/'&&r[0][k]&&r[0][k].v16)m[k]=1});delete m['/2025/04/hippies.html'];kFilms=m;return m});return kFilmP}
  var FILM_SVG='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="M10 9.2v5.6l4.6-2.8z" fill="currentColor"></path></svg>';
  function kInPost(b){if(b.closest('li,a.k5,.kcard,article.kps,article.plane,.kser-items,.related,.side,.three,.kstart3,.kstart5'))return false;return !!b.closest('.prose,.poem-body,.post-body,.kshare,.kshare-float,.kpost-head,.post-header,article.post')}
  function filmButtons(){
    var sh=Array.prototype.filter.call(document.querySelectorAll('.kact-share'),function(b){return !kInPost(b)});if(!sh.length)return;
    kFilmList().then(function(m){
      Array.prototype.forEach.call(document.querySelectorAll('.kact-share'),function(b){
        if(kInPost(b)||!b.parentNode)return;
        var a=b.closest('a[href]')||((b.closest('li,article')||{querySelector:function(){return null}}).querySelector('a[href]:not(.chip)')),u=b.getAttribute('data-url')||(a&&a.getAttribute('href'))||'',p=u.replace(/^https?:\/\/[^\/]+/,'').split(/[?#]/)[0],has=!!(p&&m[p]);
        var v=document.createElement(b.tagName==='BUTTON'?'button':'span');if(v.tagName==='BUTTON')v.type='button';
        v.className=b.className.replace(/\bkact-share\b/,'kact-film')+' kfilm-btn'+(has?'':' is-off');
        v.innerHTML=FILM_SVG+(b.querySelector('span')?'<span>'+(has?'Film':'Film soon')+'</span>':'');
        var lab=b.querySelector('span');if(lab){var sp=v.querySelector('span');sp.className=lab.className;sp.setAttribute('style',lab.getAttribute('style')||'')}
        if(has){if(v.tagName!=='BUTTON'){v.setAttribute('role','link');v.tabIndex=0}v.setAttribute('data-to',p+'#kfilm');v.title='Watch the film';v.setAttribute('aria-label','Watch the film')}
        else{v.title='Film coming later';v.setAttribute('aria-hidden','true');v.tabIndex=-1;if(v.tagName==='BUTTON')v.disabled=true}
        b.parentNode.replaceChild(v,b);
      });
    });
  }
  document.addEventListener('click',function(e){var v=e.target.closest&&e.target.closest('.kfilm-btn');if(!v)return;e.preventDefault();e.stopPropagation();var to=v.getAttribute('data-to');if(to)location.href=to},true);
  document.addEventListener('keydown',function(e){if(e.key!=='Enter')return;var v=e.target.closest&&e.target.closest('.kfilm-btn[data-to]');if(v){e.preventDefault();location.href=v.getAttribute('data-to')}},true);
  function all(){shelves();order();paint();rows();deck();heroTint();onerow();gallery();about();soften();caps();listNotes();tagWheel();serCounts();startTint();startSubs();homeTint();partThumbs();danda();filmButtons();evenUp()}
  var t=0;
  function go(){all();if(window.MutationObserver){new MutationObserver(function(){if(t)return;t=setTimeout(function(){t=0;all()},60)}).observe(document.body,{childList:true,subtree:true})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

/* v10: show the post header only once it has settled (see the k-hd-ok rule in kafka-skin). Watches the header height, the title
   height and where the text starts; reveals after 350 ms without change, or at 1.5 s whatever happens. */
(function(){
  var b=document.body;if(!b||!b.classList.contains('is-post')||b.classList.contains('k-hd-ok'))return;
  var t0=Date.now(),last='',since=t0;
  function sig(){var h=document.querySelector('#Blog1>header.post-head');if(!h)return'x';var t=h.querySelector('h1'),p=document.querySelector('#Blog1>.prose,#Blog1>article');
    return [h.offsetHeight,t?t.offsetHeight:0,p?Math.round(p.getBoundingClientRect().top+scrollY):0,h.childElementCount].join(',')}
  function done(){b.classList.add('k-hd-ok')}
  (function tick(){var now=Date.now(),s=sig();if(s!==last){last=s;since=now}
    if(now-since>=350||now-t0>=1500)return done();
    setTimeout(tick,50)})();
})();

/* v12: tap an item on a phone to show why it is on the shelf; tap again (or another item) to close */
(function(){
  var SEL='.kafka-list[data-list="songs"] .kafka-item,.kafka-list[data-list="books"] .kafka-item,.kafka-list[data-list="movies"] .kafka-item,.kafka-list[data-list="series"] .kafka-item', cur=null;
  function why(it){return it.querySelector('.kafka-item-note,.kafka-item-quote,.kafka-item-more')}
  function mark(){[].forEach.call(document.querySelectorAll(SEL),function(it){if(why(it)&&!it.hasAttribute('tabindex'))it.setAttribute('tabindex','0')})}
  document.addEventListener('click',function(e){
    var it=e.target.closest&&e.target.closest(SEL);
    if(cur&&cur!==it){cur.classList.remove('k-hl');cur=null}
    if(!it||(e.target.closest&&e.target.closest('a'))||!why(it))return;
    it.classList.toggle('k-hl');cur=it.classList.contains('k-hl')?it:null;
  },true);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&cur){cur.classList.remove('k-hl');cur=null}
    if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches(SEL)&&why(e.target)){e.preventDefault();e.target.click()}
  });
  mark();setTimeout(mark,800);setTimeout(mark,2500);window.addEventListener('load',mark);
})();

/* v15: Read / Listen links are icon-only; the words stay as the accessible name and tooltip */
(function(){
  function icons(){
    document.querySelectorAll('.kafka-item-free a').forEach(function(a){
      if(a.dataset.ico) return;
      var txt=a.textContent.replace(/\s+/g,' ').trim(); if(!txt) return;
      var m=txt.match(/^(\S+)\s+(.+)$/); if(!m) return;
      a.dataset.ico='1'; a.setAttribute('aria-label',m[2]+' (free)'); a.title=m[2]+' — free copy';
      a.textContent=m[1];
    });
  }
  icons(); document.addEventListener('DOMContentLoaded',icons); window.addEventListener('load',icons); setTimeout(icons,1200);
})();

/* v21: panel colour fallback + icon links (Spotify, where-to-watch, library finder) on the Songs / Books / Series lists */
(function(){
  var ALL='.kafka-list[data-list="songs"] .kafka-item,.kafka-list[data-list="books"] .kafka-item,.kafka-list[data-list="movies"] .kafka-item,.kafka-list[data-list="series"] .kafka-item';
  function txt(el){return el?el.textContent.replace(/\s+/g,' ').trim():''}
  function hue(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%360;return h}
  /* 1. every card has something to paint behind "why I keep it": its cover, else a colour taken from its title */
  function tint(){[].forEach.call(document.querySelectorAll(ALL),function(it){
    if(it.style.getPropertyValue('--kbg'))return;
    var im=it.querySelector('.kt-art img'),u=im&&(im.currentSrc||im.src);
    if(u){it.style.setProperty('--kbg','url("'+u.replace(/"/g,'%22')+'")');return}
    var h=hue(txt(it.querySelector('h3')));
    it.style.setProperty('--kbg','linear-gradient(135deg,hsl('+h+',55%,70%),hsl('+((h+55)%360)+',50%,84%))');
  })}
  /* 2. icon links */
  var G={
    spotify:'<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1db954"/><path d="M6.2 9.2c3.9-1.1 8.1-.8 11.6 1M6.8 12.5c3.3-.9 6.7-.6 9.6.9M7.4 15.6c2.6-.6 5.2-.4 7.5.7" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/></svg>',
    youtube:'<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="4" fill="#e62117"/><path d="M10 9.3v5.4l4.6-2.7z" fill="#fff"/></svg>',
    netflix:'<span style="font:700 12px/1 Georgia,serif;color:#e50914">N</span>',
    prime:'<span style="font:700 9px/1 Inter,system-ui,sans-serif;color:#00a8e1">prime</span>',
    hulu:'<span style="font:700 9px/1 Inter,system-ui,sans-serif;color:#1ce783;background:#0b0c0f;padding:2px 3px;border-radius:2px">hulu</span>',
    where:'<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="#7b2d26" stroke-width="2"/><path d="m15.2 15.2 5 5" stroke="#7b2d26" stroke-width="2.2" stroke-linecap="round"/></svg>',
    library:'<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M3 9.5 12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" fill="none" stroke="#7b2d26" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    read:'<span>📖</span>',listen:'<span>🎧</span>'
  };
  function add(it,list){
    var box=it.querySelector(':scope>.kafka-item-free');
    if(!box){box=document.createElement('p');box.className='kafka-item-free';it.appendChild(box)}
    list.forEach(function(x){
      if(box.querySelector('a[data-k="'+x.k+'"]'))return;
      var a=document.createElement('a');a.href=x.u;a.target='_blank';a.rel='noopener';a.dataset.ico='1';a.dataset.k=x.k;
      a.title=x.t;a.setAttribute('aria-label',x.t);a.innerHTML=G[x.k]||x.k;box.appendChild(a);
    });
  }
  function q(s){return encodeURIComponent(s)}
  function who(it){return txt(it.querySelector('.kafka-item-by')).replace(/,?\s*\d{4}.*$/,'').replace(/^Directed by\s*/i,'').split(' · ')[0].trim()}
  function songs(){[].forEach.call(document.querySelectorAll('.kafka-list[data-list="songs"] .kafka-item:not(.kafka-album)'),function(it){
    var t=txt(it.querySelector('h3')),a=who(it);if(!t)return;
    add(it,[{k:'spotify',t:'Listen on Spotify',u:'https://open.spotify.com/search/'+q(t+' '+a)}]);
  })}
  function series(){[].forEach.call(document.querySelectorAll('.kafka-list[data-list="series"] .kafka-item'),function(it){
    var t=txt(it.querySelector('h3'));if(!t)return;
    add(it,[
      {k:'youtube',t:'Search on YouTube',u:'https://www.youtube.com/results?search_query='+q(t+' tv series')},
      {k:'netflix',t:'Search on Netflix',u:'https://www.netflix.com/search?q='+q(t)},
      {k:'prime',t:'Search on Prime Video',u:'https://www.amazon.com/s?i=instant-video&k='+q(t)},
      {k:'hulu',t:'Search on Hulu',u:'https://www.hulu.com/search?q='+q(t)},
      {k:'where',t:'Where to watch (JustWatch)',u:'https://www.justwatch.com/us/search?q='+q(t)}
    ]);
  })}
  function books(){[].forEach.call(document.querySelectorAll('.kafka-list[data-list="books"] .kafka-item'),function(it){
    if(it.querySelector(':scope>.kafka-item-free a:not([data-k="library"])'))return;     /* a free copy exists: no library link needed */
    var t=txt(it.querySelector('h3')).replace(/\s*\(.*?\)\s*/g,' ').trim(),a=who(it);if(!t)return;
    add(it,[{k:'library',t:'Find it in a library near you (WorldCat)',u:'https://search.worldcat.org/search?q='+q(t+' '+a)}]);
  })}
  function run(){tint();songs();series();books()}
  run();document.addEventListener('DOMContentLoaded',run);window.addEventListener('load',run);setTimeout(run,1200);setTimeout(run,3000);
})();

/* v21b: every tile carries a line under its title; where the owner has not written a quote yet it is drawn from the item's own data (tags, track count) */
(function(){
  var ALL='.kafka-list[data-list="songs"] .kafka-item,.kafka-list[data-list="books"] .kafka-item,.kafka-list[data-list="movies"] .kafka-item,.kafka-list[data-list="series"] .kafka-item';
  function line(){[].forEach.call(document.querySelectorAll(ALL),function(it){
    if(it.querySelector('.kafka-item-quote,.kafka-item-line'))return;
    var tag=it.querySelector('.kafka-item-tag'),by=it.querySelector('.kafka-item-by');
    var t=(tag?tag.textContent:'').replace(/\s+/g,' ').trim();
    var m=(it.textContent.match(/(\d+)\s+songs?\s+here/i)||[])[1];
    if(!t){var sh=it.closest('.kshelf'),hd=sh&&sh.querySelector('h2,.kafka-list-shelf');if(!hd){var e=it;while(e&&!hd){e=e.previousElementSibling||(e.parentNode&&e.parentNode.previousElementSibling);if(e&&/^H2$/.test(e.tagName))hd=e;if(e&&e.querySelector&&!hd)hd=e.querySelector('h2')}}t=hd?[].filter.call(hd.childNodes,function(n){return n.nodeType===3}).map(function(n){return n.textContent}).join(' ').replace(/\s+/g,' ').replace(/^.*?:\s*/,'').trim():''}
    var parts=[];if(t)parts.push(t);if(m)parts.push(m+' tracks');
    if(!parts.length)return;
    if(!by)return;var p=document.createElement('span');p.className='kafka-item-line';p.textContent=parts.join(' \u00b7 ');by.appendChild(p);
  })}
  line();document.addEventListener('DOMContentLoaded',line);window.addEventListener('load',line);setTimeout(line,1200);
})();

/* v25: original generated cover art for every tile that has no real cover (abstract poster with the title on it; nothing copied from any real artwork) */
(function(){
  var ALL='.kafka-list[data-list="songs"] .kafka-item,.kafka-list[data-list="books"] .kafka-item,.kafka-list[data-list="movies"] .kafka-item,.kafka-list[data-list="series"] .kafka-item';
  function H(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function wrap(t,n){var w=t.split(/\s+/),l=[],c='';w.forEach(function(x){if((c+' '+x).trim().length>n&&c){l.push(c);c=x}else c=(c+' '+x).trim()});if(c)l.push(c);
    while(l.length>4){var a=l.pop();l[l.length-1]+=' '+a}return l}
  function motif(k,W,Hh,c2,c3,r){var o='',cx=W*.5,cy=Hh*.36;
    switch(k%6){
      case 0:for(var i=0;i<7;i++)o+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(W*.07+i*W*.055)+'" fill="none" stroke="'+(i%2?c3:c2)+'" stroke-width="'+(2+r(i)%3)+'" opacity="'+(.9-i*.09)+'"/>';o+='<circle cx="'+cx+'" cy="'+cy+'" r="'+W*.05+'" fill="'+c3+'"/>';break;
      case 1:o+='<circle cx="'+cx+'" cy="'+cy+'" r="'+W*.2+'" fill="'+c3+'"/>';for(var j=0;j<6;j++)o+='<rect x="0" y="'+(cy+W*.02+j*W*.045)+'" width="'+W+'" height="'+(W*.02+j*1.2)+'" fill="'+c2+'" opacity="'+(.85-j*.1)+'"/>';break;
      case 2:for(var d=0;d<6;d++)o+='<polygon points="'+(-W*.2+d*W*.24)+','+Hh*.62+' '+(d*W*.24)+','+Hh*.08+' '+(d*W*.24+W*.1)+','+Hh*.08+' '+(-W*.1+d*W*.24)+','+Hh*.62+'" fill="'+(d%2?c2:c3)+'" opacity="'+(.55+(d%3)*.12)+'"/>';break;
      case 3:for(var y=0;y<4;y++)for(var x=0;x<5;x++){var s=W*.09;o+='<polygon points="'+(W*.1+x*W*.19)+','+(Hh*.1+y*W*.19)+' '+(W*.1+x*W*.19+s)+','+(Hh*.1+y*W*.19+s)+' '+(W*.1+x*W*.19)+','+(Hh*.1+y*W*.19+2*s)+' '+(W*.1+x*W*.19-s)+','+(Hh*.1+y*W*.19+s)+'" fill="'+((x+y)%2?c2:c3)+'" opacity="'+(.5+((x*y)%4)*.12)+'"/>'}break;
      case 4:for(var a=0;a<6;a++){var rr=W*(.46-a*.06);o+='<path d="M'+(cx-rr)+','+(Hh*.55)+' A'+rr+','+rr+' 0 0 1 '+(cx+rr)+','+(Hh*.55)+'" fill="none" stroke="'+(a%2?c3:c2)+'" stroke-width="'+W*.035+'" opacity="'+(.95-a*.1)+'"/>'}break;
      default:for(var w=0;w<7;w++){var yy=Hh*.12+w*Hh*.07;o+='<path d="M0,'+yy+' Q'+W*.25+','+(yy-W*.09)+' '+W*.5+','+yy+' T'+W+','+yy+'" fill="none" stroke="'+(w%2?c3:c2)+'" stroke-width="'+(W*.02+w*.6)+'" opacity="'+(.9-w*.09)+'"/>'}}
    return o}
  function svg(title,sub,square){
    var h=H(title+'|'+sub),hue=h%360,W=300,Hh=square?300:450;
    var c1='hsl('+hue+',46%,20%)',c1b='hsl('+((hue+28)%360)+',50%,34%)',c2='hsl('+((hue+36)%360)+',62%,56%)',c3='hsl('+((hue+185)%360)+',70%,82%)';
    var r=function(i){return (h>>(i%24))&7};
    var lines=wrap(title,square?15:14),longest=Math.max.apply(null,lines.map(function(x){return x.length})),fs=Math.max(square?20:22,Math.min(square?34:40,Math.floor(W*.84/(longest*.52))));
    var ty=Hh*(square?.68:.66),t='';
    lines.forEach(function(l,i){t+='<text x="'+W/2+'" y="'+(ty+i*fs*1.08)+'" text-anchor="middle" font-family="Georgia,\'IM Fell English\',serif" font-weight="700" font-size="'+fs+'" fill="#fff8ea" stroke="rgba(0,0,0,.35)" stroke-width="3" paint-order="stroke" letter-spacing=".3">'+esc(l)+'</text>'});
    var s=sub?'<text x="'+W/2+'" y="'+(Hh-(square?20:30))+'" text-anchor="middle" font-family="\'Courier New\',monospace" font-size="'+(square?13:14)+'" letter-spacing="2.5" fill="'+c3+'">'+esc(sub.toUpperCase().slice(0,30))+'</text>':'';
    var out='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+Hh+'"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c1b+'"/><stop offset="1" stop-color="'+c1+'"/></linearGradient><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></linearGradient><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="'+(h%90)+'"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .09 0"/></filter></defs>'
      +'<rect width="'+W+'" height="'+Hh+'" fill="url(#a)"/>'+motif(h>>3,W,Hh,c2,c3,r)+'<rect width="'+W+'" height="'+Hh+'" fill="url(#v)"/><rect width="'+W+'" height="'+Hh+'" filter="url(#g)"/>'
      +'<rect x="9" y="9" width="'+(W-18)+'" height="'+(Hh-18)+'" fill="none" stroke="'+c3+'" stroke-opacity=".55" stroke-width="1.4"/>'+t+s+'</svg>';
    return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(out)}
  function bad(im){return !im||(im.complete&&im.naturalWidth===0)||im.dataset.dead==='1'}
  function art(){[].forEach.call(document.querySelectorAll(ALL),function(it){
    var a=it.querySelector('.kt-art'),im=a&&a.querySelector('img:not([data-gen])');
    if(a&&im&&!bad(im)){return}
    if(!a){a=document.createElement('div');a.className='kt-art';a.setAttribute('aria-hidden','true');it.insertBefore(a,it.firstChild)}
    if(a.querySelector('img[data-gen]'))return;
    var h3=it.querySelector('h3'),by=it.querySelector('.kafka-item-by'),list=it.closest('.kafka-list'),sq=list&&list.getAttribute('data-list')==='songs';
    var title=(h3?h3.textContent:'').replace(/\s+/g,' ').replace(/\s*\(.*?\)\s*$/,'').trim();
    var bt=by?[].map.call(by.childNodes,function(n){return n.nodeType===3?n.textContent:(n.classList&&n.classList.contains('kafka-item-line')?'':'')}).join(' ').replace(/\s+/g,' ').trim():'';
    var src=svg(title||'Untitled',bt,sq);
    if(im)im.remove();
    [].forEach.call(a.querySelectorAll('.kt-tile'),function(x){x.remove()});
    var g=document.createElement('img');g.setAttribute('data-gen','1');g.alt='';g.decoding='async';g.src=src;a.appendChild(g);a.classList.add('kt-has-img');it.classList.add('kt-on');
    it.style.setProperty('--kbg','url("'+src.replace(/"/g,'%22')+'")');
  })}
  window.__kArt=art;
  art();document.addEventListener('DOMContentLoaded',art);window.addEventListener('load',art);setTimeout(art,1500);setTimeout(art,4000);setTimeout(art,8000);
})();

/* v22: build the bookplate inside each "why I keep it" panel */
(function(){
  var ALL='.kafka-list[data-list="songs"] .kafka-item,.kafka-list[data-list="books"] .kafka-item,.kafka-list[data-list="movies"] .kafka-item,.kafka-list[data-list="series"] .kafka-item';
  function el(t,c,s){var e=document.createElement(t);e.className=c;if(s!=null)e.textContent=s;return e}
  /* thumbnail for the panel: the real cover when there is one, else a copy of the item's typographic tile */
  function fig(it){
    var im=it.querySelector('.kt-art img'),src=im&&(im.currentSrc||im.src),f=el('div','kn-fig');
    if(src){var c=el('img','kn-cover');c.alt='';c.src=src;f.appendChild(c);return f}
    var a=it.querySelector('.kt-art');if(a&&a.children.length){var k=a.cloneNode(true);k.classList.add('kn-art');k.removeAttribute('style');k.setAttribute('aria-hidden','true');f.appendChild(k);return f}
    return null}
  function plate(){[].forEach.call(document.querySelectorAll(ALL),function(it){
    var n=it.querySelector(':scope>.kafka-item-note');if(!n||n.hasAttribute('data-kn'))return;
    var h=it.querySelector('h3'),by=it.querySelector('.kafka-item-by');if(!h)return;
    var body=n.textContent.replace(/\s+/g,' ').trim();if(!body)return;
    var im=it.querySelector('.kt-art img'),src=im&&(im.currentSrc||im.src);
    var b=by?by.cloneNode(true):null;if(b){[].forEach.call(b.querySelectorAll('.kafka-item-line,img'),function(x){x.remove()})}
    n.textContent='';n.setAttribute('data-kn','1');
    var f0=fig(it);if(f0)n.appendChild(f0);
    var t=el('div','kn-text');
    t.appendChild(el('span','kn-title',h.textContent.replace(/\s+/g,' ').trim()));
    var bt=b?b.textContent.replace(/\s+/g,' ').trim():'';
    if(bt){var bs=el('span','kn-by'),ym=bt.match(/^(.*?)[,\u00b7]\s*((?:1[0-9]|20)\d\d(?:[^,]*)?)$/);
      if(ym){bs.appendChild(el('span','kn-name',ym[1]));bs.appendChild(el('b','kn-year',ym[2]))}else bs.appendChild(el('span','kn-name',bt));
      t.appendChild(bs)}
    t.appendChild(el('span','kn-rule'));t.appendChild(el('span','kn-label','Why I keep it'));t.appendChild(el('span','kn-body',body));
    n.appendChild(t);
  })}
  /* fit: cover width from the panel height; drop note lines (then rule, then author) until nothing overflows */
  function fit(){[].forEach.call(document.querySelectorAll('[data-kn]'),function(n){
    var f=n.querySelector('.kn-fig'),t=n.querySelector('.kn-text'),b=n.querySelector('.kn-body'),r=n.querySelector('.kn-rule'),a=n.querySelector('.kn-by'),lb=n.querySelector('.kn-label');
    var h=n.clientHeight;if(!h)return;
    n.setAttribute('data-kns',h>=110?'l':(h>=80?'m':'s'));
    if(!f){var f2=fig(n.closest('.kafka-item'));if(f2){n.insertBefore(f2,n.firstChild);f=f2}}
    if(f)f.style.width=Math.round((h-16)*2/3)+'px';
    [r,a,lb].forEach(function(x){if(x)x.style.removeProperty('display')});
    var lines=3;b.style.webkitLineClamp=lines;
    while(t.scrollHeight>t.clientHeight+1&&lines>1){lines--;b.style.webkitLineClamp=lines}
    if(t.scrollHeight>t.clientHeight+1&&r)r.style.setProperty('display','none','important');
    if(t.scrollHeight>t.clientHeight+1&&a)a.style.setProperty('display','none','important');
    if(t.scrollHeight>t.clientHeight+1&&lb)lb.style.setProperty('display','none','important');
  })}
  function go(){plate();fit()}
  /* a half-visible card at the edge of a shelf slides fully into view when it is hovered or tapped, so its panel is never cut */
  function reveal(it){var s=it&&it.closest('.kshelf-strip');if(!s)return;var a=it.getBoundingClientRect(),b=s.getBoundingClientRect(),d=0;
    if(a.right>b.right-4||a.left<b.left+4)d=a.left-b.left; /* align to the strip's snap start */
    if(d)s.scrollBy({left:d,behavior:'smooth'})}
  var lastIt=null;
  document.addEventListener('mouseover',function(e){var it=e.target.closest&&e.target.closest('.kafka-item');if(it){clearTimeout(go._h);go._h=setTimeout(fit,30);if(it!==lastIt){lastIt=it;clearTimeout(go._r);go._r=setTimeout(function(){reveal(it)},140)}}else lastIt=null});
  document.addEventListener('click',function(e){var it=e.target.closest&&e.target.closest('.kshelf-strip>.kafka-item');if(it)setTimeout(function(){reveal(it)},60)});
  document.addEventListener('touchstart',function(){setTimeout(fit,60)},{passive:true});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);
  window.addEventListener('resize',function(){clearTimeout(go._t);go._t=setTimeout(fit,150)});
  go();document.addEventListener('DOMContentLoaded',go);window.addEventListener('load',go);setTimeout(go,1200);setTimeout(go,3000);
})();

/* v26: one row of five social pills (X, Instagram, TikTok, Substack, Email) on tablet/phone; tag strip carries the footer links; footer = Home | banner | Back to top */
(function(){
  var SUB='https://naharchowck.substack.com/',MAIL='mailto:naharchowck@gmail.com';
  var SVG={
    sub:'<svg aria-hidden="true" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#ff6719"/><path d="M6 7h12M6 10.2h12" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/><path d="M6 13.4h12v6.1l-6-3.4-6 3.4z" fill="#fff"/></svg>',
    mail:'<svg aria-hidden="true" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#7b2d26"/><rect x="5" y="7.2" width="14" height="9.8" rx="1.8" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M5.7 8.4 12 13.1l6.3-4.7" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>'};
  function pills(){
    var side=document.querySelector('aside.side');if(!side||side.querySelector('.kxrow'))return;
    var fb=[].slice.call(side.querySelectorAll(':scope>.box.feedbox'));if(!fb.length)return;
    var row=document.createElement('div');row.className='kxrow';row.setAttribute('role','group');row.setAttribute('aria-label','Follow and contact');
    var names={x:'X',instagram:'Instagram',tiktok:'TikTok'};
    fb.forEach(function(b){var a=b.querySelector('a.follow.social');if(!a)return;var k=b.getAttribute('data-feed');
      var c=document.createElement('a');c.href=a.href;c.rel='me noopener';c.target='_blank';c.setAttribute('aria-label',(names[k]||k)+': @naharchowck');
      var s=a.querySelector('svg');if(s)c.appendChild(s.cloneNode(true));var t=document.createElement('span');t.textContent=names[k]||k;c.appendChild(t);row.appendChild(c)});
    [['Substack',SUB,SVG.sub,'Substack: naharchowck'],['Email',MAIL,SVG.mail,'Email naharchowck@gmail.com']].forEach(function(d){
      var c=document.createElement('a');c.href=d[1];if(d[1].indexOf('http')===0){c.target='_blank';c.rel='me noopener'}c.title=d[3];c.setAttribute('aria-label',d[3]);c.innerHTML=d[2]+'<span>'+d[0]+'</span>';row.appendChild(c)});
    var cs=getComputedStyle(fb[0]);
    side.insertBefore(row,fb[0]);side.classList.add('kx-on');
    if(cs.gridRowStart&&cs.gridRowStart!=='auto')row.style.gridRow=cs.gridRowStart+(cs.gridRowEnd&&cs.gridRowEnd!=='auto'?' / '+cs.gridRowEnd:'');
  }
  function foot(){
    var f=document.querySelector('footer.footer'),strip=document.querySelector('.ktagstrip');if(!f)return;
    var fl=f.querySelector('.foot-line')||(strip&&strip.querySelector('.foot-line'));
    if(fl&&!fl.querySelector('.kx-sub')){var sp=fl.querySelector(':scope>span:last-child');
      if(sp){var rss=sp.querySelector('a.rss-link'),s=document.createElement('a');s.className='kx-sub';s.href=SUB;s.target='_blank';s.rel='me noopener';s.textContent='Substack';
        var m=document.createElement('a');m.className='kx-mail';m.href=MAIL;m.textContent='Email';m.title='naharchowck@gmail.com';
        sp.insertBefore(s,rss||null);sp.insertBefore(m,rss||null)}}
    if(strip&&fl&&!strip.contains(fl))strip.appendChild(fl);
    var nav=f.querySelector('.kendnav');
    if(nav&&!nav.querySelector('.kbanner')){var b=document.createElement('a');b.className='kbanner';b.href='/';b.setAttribute('aria-label','Kafkaintherun home — a directory of random things, designed with Claude');
      var hl=document.querySelector('.site-header .logo img'),hb=document.querySelector('.site-header .hdr-badge img');
      var L=(hl&&hl.src)||'https://img.kafka.blog/googleusercontent.com/d/1GaxqgL5vx421lm9RcZkEAiNA_fY50s34=w160-rw',R=(hb&&hb.src)||'https://img.kafka.blog/googleusercontent.com/d/1NzJOfwl-j-KOxVIzm5x7FCLc11q3zGwz=w160-rw';
      b.innerHTML='<img class="kb-l" alt="" src="'+L+'"><span class="kb-c"><span class="kb-n">Kafkaintherun</span><span class="kb-s">a directory of <em>random</em> things &middot; designed with Claude</span></span><img class="kb-r" alt="" src="'+R+'">';
      var top=nav.querySelector('.kend-top');nav.insertBefore(b,top||null)}
  }
  function go(){try{pills();foot()}catch(e){}}
  go();document.addEventListener('DOMContentLoaded',go);window.addEventListener('load',go);setTimeout(go,1200);setTimeout(go,3500);
})();

/* v31: "what you will find" panels on article cards; recent / most-read lists become sideways shelves; series cards become compact tiles */
(function(){
  var MAP=null;
  function path(h){try{return new URL(h,location.origin).pathname}catch(e){return ''}}
  function feed(){if(MAP)return MAP;MAP=fetch('/feeds/posts/summary?alt=json&max-results=500').then(function(r){return r.json()}).then(function(j){var m={};((j.feed||{}).entry||[]).forEach(function(e){var l=(e.link||[]).filter(function(x){return x.rel==='alternate'})[0];if(l){m[path(l.href)]=((e.summary||{}).$t||'').replace(/\s+/g,' ').trim();m['t:'+path(l.href)]=((e.title||{}).$t||'').trim();m['d:'+path(l.href)]=(e.published||{}).$t||'';m['i:'+path(l.href)]=((e['media$thumbnail']||{}).url||'').replace(/=s\d+(-w\d+)?(-c)?$/,'=w480-rw');m['cat:'+path(l.href)]=(e.category||[]).map(function(c){return c.term}).filter(function(t){return t&&!/^(nepali|english|articles|published articles|ramblings|lang-.*|pair-.*|series-.*)$/i.test(t)}).slice(0,1).join('')}});return m}).catch(function(){return {}});return MAP}
  function snip(t){if(!t)return '';t=t.replace(/\s+/g,' ');if(t.length<=230)return t;var c=t.slice(0,230),i=Math.max(c.lastIndexOf('. '),c.lastIndexOf('। '),c.lastIndexOf('? '));if(i>110)return c.slice(0,i+1);i=c.lastIndexOf(' ');return c.slice(0,i>0?i:230)+'…'}
  function panel(host,html,href,label){if(host.querySelector(':scope>.kx-pn'))return;var p=document.createElement('div');p.className='kx-pn';p.innerHTML='<b>'+(label||'What you’ll find')+'</b>'+html+'<a class="kx-go" href="'+href+'">'+(document.documentElement.lang==='ne'?'पढ्नुहोस् ›':'Read ›')+'</a>';host.appendChild(p);host.classList.add('kx-host')}
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function run(){feed().then(function(m){
    [].forEach.call(document.querySelectorAll('.three .col ol.klist'),function(ol){
      ol.classList.add('kxs');
      [].forEach.call(ol.children,function(li){if(li.tagName!=='LI'||li.querySelector('.kx-pn'))return;var a=li.querySelector('a.tt');if(!a)return;
        var img=li.querySelector('a.pic img');if(img&&/=w\d+-rw/.test(img.src))img.src=img.src.replace(/=w\d+-rw/,'=w480-rw');
        var s=snip(m[path(a.href)]);if(!s)s='';var dv=li.querySelector(':scope>div');var cat=m['cat:'+path(a.href)];if(dv&&!dv.querySelector('.kx-sn')){if(s){var sn=document.createElement('p');sn.className='kx-sn';sn.textContent=s.length>96?s.slice(0,s.lastIndexOf(' ',96)||96)+'\u2026':s;a.insertAdjacentElement('afterend',sn)}}if(cat&&!li.querySelector('.kx-cat')){var cc=document.createElement('span');cc.className='kx-cat';cc.textContent=cat;li.appendChild(cc)}panel(li,s?'<p>'+esc(s)+'</p>':'<p></p>',a.href)})});
    [].forEach.call(document.querySelectorAll('.kstart5>a.k5'),function(a){if(a.querySelector(':scope>.kx-pn'))return;var u=path(a.href),sm=snip(m[u]),b=a.querySelector('.k5-b'),t=a.querySelector('.k5-t'),im=a.querySelector('.k5-img');
      if(im&&im.style.backgroundImage)im.style.backgroundImage=im.style.backgroundImage.replace(/=w\d+-rw/,'=w480-rw');
      if(sm&&t&&b&&!b.querySelector('.kx-sn')){var sn=document.createElement('span');sn.className='kx-sn';sn.textContent=sm.length>96?sm.slice(0,sm.lastIndexOf(' ',96)||96)+'\u2026':sm;t.insertAdjacentElement('afterend',sn)}
      var cat=m['cat:'+u];if(cat&&!a.querySelector(':scope>.kx-cat')){var cc=document.createElement('span');cc.className='kx-cat';cc.textContent=cat;a.appendChild(cc)}
      var pn=document.createElement('div');pn.className='kx-pn';pn.innerHTML='<b>What you\u2019ll find</b><p>'+esc(sm)+'</p><span class="kx-go">'+(document.documentElement.lang==='ne'?'पढ्नुहोस् ›':'Read ›')+'</span>';a.appendChild(pn);a.classList.add('kx-host')});
    [].forEach.call(document.querySelectorAll('article.kcard,article.sq'),function(ar){var a=ar.querySelector('a[href$=".html"]');if(!a)return;var s=snip(m[path(a.href)]);if(s)panel(ar,'<p>'+esc(s)+'</p>',a.href)});
    [].forEach.call(document.querySelectorAll('.series2.six>.scol'),function(sc){if(sc.querySelector(':scope>.kx-pn'))return;var ls=[].slice.call(sc.querySelectorAll('details.run ol.slist li a.tt')).slice(0,4);var h3=sc.querySelector('h3 a.ser-link');var cnt=sc.querySelector('.runcount');
      if(!ls.length||!h3)return;panel(sc,'<ol>'+ls.map(function(x){return '<li>'+esc(x.textContent.trim())+'</li>'}).join('')+'</ol>',h3.getAttribute('href'),'In this series'+(cnt?' · '+cnt.textContent+' pieces':''));var g=sc.querySelector('.kx-go');if(g)g.textContent=(document.documentElement.lang==='ne'?'सबै हेर्नुहोस् ›':'See the series ›')})
  })}
  window.__kxFeed=feed;
  document.addEventListener('click',function(e){if(!matchMedia('(hover:none)').matches)return;var h=e.target.closest&&e.target.closest('.kx-host');
    [].forEach.call(document.querySelectorAll('.kx-host.kx-open'),function(x){if(x!==h)x.classList.remove('kx-open')});
    if(!h||e.target.closest('.kx-go'))return;if(!h.matches('.three .col ol.klist>li,.series2.six>.scol,.kstart5>a.k5,.kxs3>.kx-tile'))return;if(!h.classList.contains('kx-open')){e.preventDefault();h.classList.add('kx-open')}},true);
  run();document.addEventListener('DOMContentLoaded',run);window.addEventListener('load',run);setTimeout(run,1500);setTimeout(run,4000);
  var mo=new MutationObserver(function(){clearTimeout(mo.t);mo.t=setTimeout(run,250)});document.addEventListener('DOMContentLoaded',function(){mo.observe(document.body,{childList:true,subtree:true})});setTimeout(function(){mo.disconnect();window.addEventListener('click',function(){setTimeout(run,400)},true)},20000);
})();

/* v32c: "Most recent" and "Most read" home sections become one 3x2 sideways shelf of cover tiles (originals stay in the page, hidden) */
(function(){
  var DONE='kx3done';
  /* every post, not just the handful the server renders: recent = newest first, read = the ranked list */
  function fullTiles(m,kind){
    var paths=[],seen={};
    if(kind==='read'){var ol=[].filter.call(document.querySelectorAll('.three ol.klist'),function(o){return o.children.length>30})[0];if(!ol)return null;[].forEach.call(ol.children,function(li){var a=li.querySelector('a[href$=".html"]');if(a){var u=path(a.href);if(m['t:'+u]&&!seen[u]){seen[u]=1;paths.push(u)}}})}
    else{Object.keys(m).forEach(function(k){if(k.indexOf('d:')===0&&m['t:'+k.slice(2)])paths.push(k.slice(2))});paths.sort(function(a,b){return String(m['d:'+b]).localeCompare(String(m['d:'+a]))})}
    if(paths.length<2)return null;
    return paths.map(function(u){
      var href=location.origin+u,title=m['t:'+u],sm=(m[u]||'').replace(/\s+/g,' ').trim(),cut=sm.length>96?sm.slice(0,sm.lastIndexOf(' ',96)||96)+'…':sm;
      var long=sm.length>230?(function(){var c=sm.slice(0,230),i=Math.max(c.lastIndexOf('. '),c.lastIndexOf('। '),c.lastIndexOf('? '));return i>110?c.slice(0,i+1):c.slice(0,c.lastIndexOf(' '))+'…'})():sm;
      var cat=m['cat:'+u]||'',src=m['i:'+u]||'',ne=/[ऀ-ॿ]/.test(title);
      return '<article class="kx-tile kx-host"'+(ne?' lang="ne"':'')+'><a class="kx-cv" href="'+esc(href)+'" aria-label="'+esc(title)+'">'+(src?'<img alt="" loading="lazy" src="'+esc(src)+'">':'')+'</a>'+(cat?'<span class="kx-cat">'+esc(cat)+'</span>':'')+'<div class="kx-tx"><a class="tt" href="'+esc(href)+'">'+esc(title)+'</a>'+(cut?'<p class="kx-sn">'+esc(cut)+'</p>':'')+'<p class="d">'+esc(fmt(m['d:'+u])||'')+'</p></div><div class="kx-pn"><b>What you’ll find</b><p>'+esc(long)+'</p><a class="kx-go" href="'+esc(href)+'">Read ›</a></div></article>'});
  }
  function path(h){try{return new URL(h,location.origin).pathname}catch(e){return ''}}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
  function fmt(iso){try{return new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}catch(e){return ''}}
  function go(){
    var secs=[].filter.call(document.querySelectorAll('.sec-h'),function(h){return /^(most recent|most read|pinned)$/i.test((h.textContent||'').replace(/\s+/g,' ').trim())});
    if(!secs.length)return;
    window.__kxFeed&&window.__kxFeed().then(function(m){
      secs.forEach(function(h){
        if(h.getAttribute('data-kx3'))return;
        var sibs=[];for(var n=h.nextElementSibling;n&&!n.matches('.sec-h')&&!n.querySelector('.sec-h');n=n.nextElementSibling)sibs.push(n);
        var sel='article.krow,.sq-grid article.sq,.wheel article.mini,.track article.mini,.pin-pair article.kps,.pin-pair .kps-parts li';
        var arts=[];sibs.forEach(function(sb){if(sb.matches('article.krow'))arts.push(sb);[].forEach.call(sb.querySelectorAll(sel),function(x){arts.push(x)})});
        var pin=/^pinned$/i.test((h.textContent||'').trim()),feat=pin?document.querySelector('article.kfeat'):null;if(feat)arts.unshift(feat);
        if(arts.length<2)return;
        var seen={},tiles=[];
        arts.forEach(function(a){var l=a.querySelector('a[href$=".html"]');if(!l)return;var u=path(l.href);if(seen[u])return;seen[u]=1;
          var im=a.querySelector('img'),src=im?(im.currentSrc||im.src||''):'';src=src.replace(/=w\d+-rw/,'=w480-rw');
          var hd=a.querySelector('h1,h2,h3,h4,.tt,.k-title');var title=m['t:'+u]||(hd?hd.textContent:'')||l.getAttribute('aria-label')||l.textContent;title=title.replace(/\s+/g,' ').trim();
          var ex=a.querySelector('.exc,p:not(.by):not(.k-label):not(.d)');var sm=(m[u]||(ex?ex.textContent:'')).replace(/\s+/g,' ').trim();var cut=sm.length>96?sm.slice(0,sm.lastIndexOf(' ',96)||96)+'…':sm;
          var long=sm.length>230?(function(){var c=sm.slice(0,230),i=Math.max(c.lastIndexOf('. '),c.lastIndexOf('। '),c.lastIndexOf('? '));return i>110?c.slice(0,i+1):c.slice(0,c.lastIndexOf(' '))+'…'})():sm;
          var cat=m['cat:'+u]||'';var chip=a.querySelector('.chip');if(!cat&&chip)cat=chip.textContent.trim();
          var ne=/[ऀ-ॿ]/.test(title);
          tiles.push('<article class="kx-tile kx-host"'+(ne?' lang="ne"':'')+'><a class="kx-cv" href="'+esc(l.href)+'" aria-label="'+esc(title)+'">'+(src?'<img alt="" loading="lazy" src="'+esc(src)+'">':'')+'</a>'+(cat?'<span class="kx-cat">'+esc(cat)+'</span>':'')+'<div class="kx-tx"><a class="tt" href="'+esc(l.href)+'">'+esc(title)+'</a>'+(cut?'<p class="kx-sn">'+esc(cut)+'</p>':'')+'<p class="d">'+esc(fmt(m['d:'+u])||'')+'</p></div><div class="kx-pn"><b>What you’ll find</b><p>'+esc(long)+'</p><a class="kx-go" href="'+esc(l.href)+'">Read ›</a></div></article>')});
        if(!pin){var full=fullTiles(m,/most read/i.test(h.textContent||'')?'read':'recent');if(full&&full.length>tiles.length)tiles=full}
        if(tiles.length<2)return;
        var sh=document.createElement('div');sh.className='kxs3';sh.innerHTML=tiles.join('');sh.setAttribute('data-n',tiles.length);
        h.setAttribute('data-kx3','1');h.insertAdjacentElement('afterend',sh);if(pin){var h2=h.querySelector('h2 span,h2');if(h2){var tn=[].filter.call(h2.childNodes,function(x){return x.nodeType===3&&x.textContent.trim()})[0];if(h2.querySelector('span')&&h2.querySelector('span').children.length===0)h2.querySelector('span').textContent='Featured & pinned';else if(tn)tn.textContent='Featured & pinned'}var fh=[].filter.call(document.querySelectorAll('.sec-h'),function(x){return /^featured$/i.test((x.textContent||'').trim())})[0];if(fh){fh.classList.add('kx-hid')}if(feat)feat.classList.add('kx-hid')}
        sibs.forEach(function(c){if(c.matches('article.krow,.sq-grid,.wheel-plane,.pin-pair'))c.classList.add('kx-hid')});
      })})}
  go();document.addEventListener('DOMContentLoaded',go);window.addEventListener('load',go);setTimeout(go,1800);setTimeout(go,4500);setTimeout(go,9000);
})();

/* v34: show-more for phone shelves */
(function(){function more(){return;try{document.querySelectorAll('.three .col ol.klist.kxs,.kstart5,.kxs3,.series2.six').forEach(function(s){if(s.classList.contains('kxl')||s.children.length<=6)return;s.classList.add('kxm');if(s.__kxm)return;s.__kxm=1;var b=document.createElement('button');b.type='button';b.className='kx-more';b.textContent='Show more';b.addEventListener('click',function(){var all=s.classList.toggle('kx-all');b.textContent=all?'Show less':'Show more'});s.parentNode.insertBefore(b,s.nextSibling)})}catch(e){}}
var k=0,t=setInterval(function(){more();if(++k>40)clearInterval(t)},600);document.addEventListener('click',function(){setTimeout(more,200)},true)})();

/* v34b: scroll hint */
(function(){function setup(s){if(s.__kxh)return;s.__kxh=1;var pg=document.createElement('div');pg.className='kx-pg';pg.innerHTML='<i></i>';s.parentNode.insertBefore(pg,s.nextSibling);var bar=pg.firstChild;function upd(){var w=s.scrollWidth,c=s.clientWidth;if(w<=c+4){s.classList.remove('kx-sc');pg.style.display='none';return}pg.style.display='';s.classList.add('kx-sc');var m=w-c,p=s.scrollLeft/m;s.classList.toggle('kx-start',s.scrollLeft<4);s.classList.toggle('kx-end',s.scrollLeft>m-4);var f=Math.max(.15,c/w);bar.style.width=(f*100)+'%';bar.style.marginLeft=(p*(1-f)*100)+'%'}s.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);s.__kxu=upd;upd()}
function all(){try{document.querySelectorAll('.three .col ol.klist.kxs,.kstart5,.kxs3').forEach(function(s){setup(s);s.__kxu&&s.__kxu()})}catch(e){}}
var k=0,t=setInterval(function(){all();if(++k>40)clearInterval(t)},700)})();

/* v38: label / search / series list pages become the same soft tile grid */
(function(){
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
  function path(h){try{return new URL(h,location.origin).pathname}catch(e){return ''}}
  function fmt(iso){try{return new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}catch(e){return ''}}
  var sig='';
  function go(){
    if(document.body.classList.contains('k-home')||document.querySelector('.kdoors'))return;
    var cards=[].filter.call(document.querySelectorAll('article.kcard'),function(a){return !a.closest('.kxs3')&&!a.classList.contains('kx-lh')});
    if(cards.length<2||!window.__kxFeed)return;
    var key=cards.map(function(a){return a.getAttribute('data-id')}).join(',');if(key===sig)return;
    window.__kxFeed().then(function(m){
      var cs=[].filter.call(document.querySelectorAll('article.kcard'),function(a){return !a.classList.contains('kx-lh')});
      if(cs.length<2)return;
      var old=document.querySelector('.kxs3.kxl');if(old){var nx=old.nextElementSibling;while(nx&&(nx.classList.contains('kx-more')||nx.classList.contains('kx-pg'))){var r=nx;nx=nx.nextElementSibling;r.remove()}old.remove()}
      var seen={},tiles=[];
      cs.forEach(function(a){var l=a.querySelector('a.pic[href]')||a.querySelector('a[href$=".html"]');if(!l)return;var u=path(l.href);if(seen[u])return;seen[u]=1;
        var im=a.querySelector('img'),src=im?(im.currentSrc||im.src||''):'';src=src.replace(/=w\d+-rw/,'=w480-rw');
        var hd=a.querySelector('h2,h3,.tt');var title=m['t:'+u]||(hd?hd.textContent:'')||l.textContent;title=title.replace(/\s+/g,' ').trim();
        var sm=(m[u]||'').replace(/\s+/g,' ').trim();var cut=sm.length>96?sm.slice(0,sm.lastIndexOf(' ',96)||96)+'…':sm;
        var long=sm.length>230?(function(){var c=sm.slice(0,230),i=Math.max(c.lastIndexOf('. '),c.lastIndexOf('। '),c.lastIndexOf('? '));return i>110?c.slice(0,i+1):c.slice(0,c.lastIndexOf(' '))+'…'})():sm;
        var chip=a.querySelector('.chip');var cat=chip?chip.textContent.trim():(m['cat:'+u]||'');
        var ne=/[ऀ-ॿ]/.test(title);
        tiles.push('<article class="kx-tile kx-host"'+(ne?' lang="ne"':'')+'><a class="kx-cv" href="'+esc(l.href)+'" aria-label="'+esc(title)+'">'+(src?'<img alt="" loading="lazy" src="'+esc(src)+'">':'')+'</a>'+(cat?'<span class="kx-cat">'+esc(cat)+'</span>':'')+'<div class="kx-tx"><a class="tt" href="'+esc(l.href)+'">'+esc(title)+'</a>'+(cut?'<p class="kx-sn">'+esc(cut)+'</p>':'')+'<p class="d">'+esc(fmt(m['d:'+u])||'')+'</p></div><div class="kx-pn"><b>What you’ll find</b><p>'+esc(long)+'</p><a class="kx-go" href="'+esc(l.href)+'">Read ›</a></div></article>')});
      if(tiles.length<2)return;
      var sh=document.createElement('div');sh.className='kxs3 kxl';sh.innerHTML=tiles.join('');sh.setAttribute('data-n',tiles.length);
      cs[0].insertAdjacentElement('beforebegin',sh);
      cs.forEach(function(a){a.classList.add('kx-hid')});
      sig=key;
    })}
  go();document.addEventListener('DOMContentLoaded',go);window.addEventListener('load',go);[1200,2500,5000,9000].forEach(function(t){setTimeout(go,t)});
  document.addEventListener('click',function(){setTimeout(go,600)},true);
})();

/* v42: slim pager line under every tile block - arrows, red accent progress, post counter */
(function(){
  var SEL='.three .col ol.klist.kxs,.kstart5,.kxs3';
  function bar(s){
    if(s.__kb)return;s.__kb=1;
    var d=document.createElement('div');d.className='kx-bar';
    d.innerHTML='<button type="button" class="kb-p" aria-label="Previous">‹</button><span class="kb-t"><i></i></span><span class="kb-n"></span><button type="button" class="kb-x" aria-label="More">›</button>';
    s.parentNode.insertBefore(d,s.nextSibling);
    var P=d.querySelector('.kb-p'),X=d.querySelector('.kb-x'),T=d.querySelector('.kb-t i'),N=d.querySelector('.kb-n');
    function gcd(a,b){return b?gcd(b,a%b):a}
    /* last column fills the whole height: its tiles stretch evenly so no empty cells are left */
    function fit(s,ts){
      var ld=s.hasAttribute('data-lead')&&ts.length>4?ts[0]:null;if(ld){ts=ts.slice(1);ld.style.removeProperty('grid-row')}
      var rr=fit0(s,ts);if(ld){var rows=getComputedStyle(s).gridTemplateRows.split(' ').length;ld.style.setProperty('grid-row','span '+rows,'important')}return rr}
    function fit0(s,ts){
      var n=ts.length;
      s.style.removeProperty('grid-template-rows');ts.forEach(function(t){t.style.removeProperty('grid-row')});
      var cs=getComputedStyle(s);if(cs.gridAutoFlow.indexOf('column')<0)return 0;
      var r=cs.gridTemplateRows.split(' ').length;if(r<2||n<=r)return r;
      var k=n%r;if(!k)return r;
      var rh=ts[0].getBoundingClientRect().height,g=parseFloat(cs.rowGap)||0;if(!rh)return r;
      var B=r*k/gcd(r,k),sN=B/r,sL=B/k,u=(rh-(sN-1)*g)/sN;if(u<0.4)return r;
      s.style.setProperty('grid-template-rows','repeat('+B+','+u+'px)','important');
      ts.forEach(function(t,i){t.style.setProperty('grid-row','span '+(i>=n-k?sL:sN),'important')});
      return r;
    }
    function tiles(){return [].filter.call(s.children,function(c){return !c.classList.contains('k5-more')&&getComputedStyle(c).display!=='none'})}
    function upd(){
      var ts=tiles(),n=ts.length;if(!n)return;if(s.getAttribute('data-n')!==String(n))s.setAttribute('data-n',n);[].forEach.call(s.querySelectorAll('.kx-last'),function(e){e.classList.remove('kx-last')});ts[n-1].classList.add('kx-last');
      var ph=matchMedia('(max-width:640px)').matches,kxl=s.classList.contains('kxl');
      var fr=fit(s,ts);
      var over=s.scrollWidth>s.clientWidth+4;
      d.classList.toggle('kb-flat',!over);
      if(!over){N.textContent=n+(n===1?' post':' posts');return}
      var rows=fr>1?fr:(ph?(kxl?8:3):2),cols=ph?2:3,per=rows*cols;
      var cw=ts[0].getBoundingClientRect().width+(ph?8:12);
      var col=Math.round(s.scrollLeft/cw),a=Math.min(n,col*rows+1),b=Math.min(n,a+per-1);
      N.textContent=a+'–'+b+' of '+n;
      var m=s.scrollWidth-s.clientWidth,f=Math.max(.12,s.clientWidth/s.scrollWidth),p=m>0?s.scrollLeft/m:0;
      T.style.width=(f*100)+'%';T.style.marginLeft=(p*(1-f)*100)+'%';
      P.disabled=s.scrollLeft<4;X.disabled=s.scrollLeft>m-4;
    }
    function step(dir){s.scrollBy({left:dir*(s.clientWidth-8),behavior:'smooth'})}
    P.addEventListener('click',function(){step(-1)});X.addEventListener('click',function(){step(1)});
    s.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);s.__kbu=upd;upd();
  }
  function all(){try{document.querySelectorAll(SEL).forEach(function(s){if(!s.children.length||!s.offsetHeight)return;bar(s);s.__kbu&&s.__kbu()})}catch(e){}}
  var k=0,t=setInterval(function(){all();if(++k>50)clearInterval(t)},700);
  document.addEventListener('click',function(){setTimeout(all,500)},true);
})();

/* v46: Science / History pages are organised by topic - a decorated header per topic and the same soft tile blocks */
(function(){
  var CFG={
    '/p/science.html':[
      {k:'cancer',t:'Cancer & viruses',n:'क्यान्सर र भाइरस',b:'How viruses, genes and the immune system meet cancer, and what the lab results really mean.',c:'#a8665b',g:'✴',re:/virus|cancer|sharirma-dera|musama|hatti|elephant|pancreatic/},
      {k:'medicine',t:'Medicine & the body',n:'औषधि र शरीर',b:'Long COVID, transplants and the health stories written into families.',c:'#4f6a7a',g:'✚',re:/covid|kidney|mirgaula|cousin|mamachela/},
      {k:'dna',t:'DNA, genes & credit',n:'डीएनए र जिन',b:'How the code copies itself, and who got the credit for finding it.',c:'#6e5a7e',g:'✵',re:/dna|darkantigens|rosalind|nobel/},
      {k:'animals',t:'Strange lives of animals',n:'जीवजन्तुका अचम्म',b:'Lobsters that do not age, eels from the Sargasso, salamanders that regrow legs.',c:'#5b7f6e',g:'✿',re:/lobster|eel|bam-machha|salamand|thakthake|lovers-of-solitude|phatyangra/}
    ],
    '/p/history.html':[
      {k:'sumer',t:'Sumer & Mesopotamia',n:'सुमेर र मेसोपोटामिया',b:'From the first flood-fed fields to the first writing, empires and laments.',c:'#a8665b',g:'✴',re:/sumer|akkad|uruk|lagash|eridu|mesopotamia|dui-nadi|badhidekhi|flood|sansar-dubaeko|kushim|between-two-rivers|sargon|the-city-of/},
      {k:'roman',t:'Roman Britannia',n:'रोमन ब्रिटानिया',b:'Giants, walls, warlords and the long goodbye.',c:'#4f6a7a',g:'♕',re:/britannia/},
      {k:'smallpox',t:'Smallpox in Nepal',n:'नेपालमा बिफर',b:'Rana Bahadur, Shitala Maju and the vaccine that took 159 years.',c:'#7b2d26',g:'✵',re:/smallpox|bifar/},
      {k:'faith',t:'Faith before farming',n:'भोकभन्दा पहिले आस्था',b:'When temples gave birth to villages.',c:'#9a7a2e',g:'✦',re:/faith-before|gobekli/},
      {k:'more',t:'Lives, music & memory',n:'जीवन, सङ्गीत र स्मृति',b:'Kathmandu’s hippies, a silent Buddha, Dylan and the people history forgot.',c:'#5b7f6e',g:'♫',re:/./}
    ]
  };
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
  function go(){
    var key=location.pathname.replace(/\/+$/,'');var cfg=CFG[key];if(!cfg)return;
    var ol=document.querySelector('ol.kser-items');if(!ol||ol.getAttribute('data-kxt'))return;
    var lis=[].filter.call(ol.children,function(l){return l.tagName==='LI'&&l.querySelector('h2 a')});if(lis.length<6)return;
    if(!lis.some(function(l){return l.querySelector('img')}))return;
    var buckets={};cfg.forEach(function(t){buckets[t.k]=[]});
    lis.forEach(function(l){var a=l.querySelector('h2 a');var h=a.getAttribute('href');var u=h.replace(/^https?:\/\/[^/]+/,'');for(var i=0;i<cfg.length;i++){if(cfg[i].re.test(u)){buckets[cfg[i].k].push(l);break}}});
    var html='',nav='';
    cfg.forEach(function(t){var b=buckets[t.k];if(!b.length)return;
      var tiles=b.map(function(l){var a=l.querySelector('h2 a');var href=a.href;var title=a.textContent.replace(/\s+/g,' ').trim();var im=l.querySelector('img');var src=im?(im.currentSrc||im.src||''):'';src=src.replace(/=w\d+(-rw)?$/,'=w480-rw');
        var sub=l.querySelector('.kt-sub,.kt-dek,p:not(.kser-date)');var sm=(sub?sub.textContent:'').replace(/\s+/g,' ').trim();var cut=sm.length>96?sm.slice(0,sm.lastIndexOf(' ',96)||96)+'…':sm;
        var dt=l.querySelector('.kser-date span');var dd=(dt?dt.textContent:'').replace(/\s+/g,' ').trim();dd=dd.split('\u00b7')[0].replace(/^\d+\s+/,'').replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*/,'$1').trim();var ne=l.getAttribute('lang')==='ne'||/[ऀ-ॿ]/.test(title);
        var long=sm.length>230?sm.slice(0,sm.lastIndexOf(' ',230))+'…':sm;
        return '<article class="kx-tile kx-host"'+(ne?' lang="ne"':'')+'><a class="kx-cv" href="'+esc(href)+'" aria-label="'+esc(title)+'">'+(src?'<img alt="" loading="lazy" src="'+esc(src)+'">':'')+'</a><span class="kx-cat">'+(ne?'नेपाली':'English')+'</span><div class="kx-tx"><a class="tt" href="'+esc(href)+'">'+esc(title)+'</a>'+(cut?'<p class="kx-sn">'+esc(cut)+'</p>':'')+'<p class="d">'+esc(dd)+'</p></div><div class="kx-pn"><b>What you’ll find</b><p>'+esc(long)+'</p><a class="kx-go" href="'+esc(href)+'">Read ›</a></div></article>'}).join('');
      html+='<section class="kx-topic" id="kxt-'+t.k+'" style="--tc:'+t.c+'"><header class="kx-th"><span class="kx-tg">'+t.g+'</span><div class="kx-tt"><h2>'+esc(t.t)+' <em lang="ne">'+esc(t.n)+'</em></h2><p>'+esc(t.b)+'</p></div><span class="kx-tc">'+b.length+'</span></header><div class="kxs3 kxt" data-n="'+b.length+'">'+tiles+'</div></section>';
      nav+='<a href="#kxt-'+t.k+'" style="--tc:'+t.c+'"><i>'+t.g+'</i>'+esc(t.t)+' <b>'+b.length+'</b></a>'});
    var wrap=document.createElement('div');wrap.className='kx-topics';wrap.innerHTML='<nav class="kx-tnav" aria-label="Topics">'+nav+'</nav>'+html;
    ol.setAttribute('data-kxt','1');ol.classList.add('kx-hid');ol.parentNode.insertBefore(wrap,ol);
  }
  go();document.addEventListener('DOMContentLoaded',go);window.addEventListener('load',go);[1200,2500,5000,9000].forEach(function(t){setTimeout(go,t)});
})();

/* v47: home Featured + pinned -> slim featured row and a Shitala Maju block (50% story, 50% two part cards) */
(function(){
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
  function tx(e){return e?e.textContent.replace(/\s+/g,' ').trim():''}
  function build(){
    var home=document.getElementById('kafka-home');if(!home||home.getAttribute('data-kfp'))return true;
    var feat=home.querySelector('article.kfeat'),pp=home.querySelector('.pin-pair');
    if(!feat||!pp)return false;
    var parts=pp.querySelectorAll('.kps-parts>li');var mainImg=pp.querySelector('.kps-pic img');
    if(!parts.length||!mainImg)return false;
    var fa=feat.querySelector('a.pic'),fi=feat.querySelector('.pic img');if(!fa||!fi)return false;
    var fh=fa.href;var ft='';[].forEach.call(feat.querySelectorAll('.txt a'),function(a){if(!ft&&a.href===fh&&!a.classList.contains('read-btn')&&a.className.indexOf('kact')<0&&a.textContent.trim().length>12)ft=tx(a)});
    var fsub=tx(feat.querySelector('.sub'));var fd='',fr='';[].forEach.call(feat.querySelectorAll('.txt span'),function(s){var t=tx(s);if(!fd&&/\d{4}/.test(t))fd=t;if(!fr&&/min read/.test(t))fr=t});
    var chip=tx(feat.querySelector('.chip'))||'History';
    var main=pp.querySelector('.kps-pic'),mh=main.href,series=tx(pp.querySelector('.kps-n'))||'2-part series',sname=tx(pp.querySelector('.kps-t'));
    var q=tx(pp.querySelector('.kb-tr')).replace(/^[“"]|[”"]$/g,'');
    var big=mainImg.src.replace(/=w\d+(-rw)?$/,'=w480-rw');
    var ph='';[].forEach.call(parts,function(li){var a=li.querySelector('a.tt'),im=li.querySelector('img');if(!a)return;
      ph+='<a class="fp-part" href="'+esc(a.href)+'"><span class="fp-pi">'+(im?'<img alt="" loading="lazy" src="'+esc(im.src)+'">':'')+'</span><span class="fp-pb"><em>'+esc(tx(li.querySelector('.kps-no')))+'</em><b>'+esc(tx(a))+'</b><small>'+esc(tx(li.querySelector('.kps-d')))+'</small></span></a>'});
    var meta=fd;
    var el=document.createElement('section');el.className='kx-fp';
    el.innerHTML='<a class="fp-hero" href="'+esc(fh)+'"><span class="fp-hi"><img alt="" loading="lazy" src="'+esc(fi.src)+'"></span><span class="fp-hb"><span class="fp-k">Featured <i>·</i> '+esc(chip)+'</span><b class="fp-t">'+esc(ft)+'</b><span class="fp-s">'+esc(fsub)+'</span><span class="fp-m">'+esc(meta)+'</span></span></a>'
      +'<div class="fp-row"><a class="fp-main" lang="ne" href="'+esc(mh)+'" style="--bg:url(\''+esc(big)+'\')"><span class="fp-mi"></span><span class="fp-mb"><span class="fp-mk">'+esc(series)+'</span><b class="fp-mt">शीतला माजुको कथा</b><i class="fp-q">“'+esc(q)+'”</i></span></a><div class="fp-parts">'+ph+'</div></div>';
    var kh=document.getElementById('kh-feat');var shelf=home.querySelector('.kxs3');
    if(!shelf)return false;
    var anchor=shelf;
    function hide(e){e.classList.add('kx-hid');e.style.setProperty('display','none','important')}
    if(shelf){var n=shelf.nextElementSibling;hide(shelf);while(n&&(n.classList.contains('kx-bar')||n.classList.contains('kx-pg'))){hide(n);n=n.nextElementSibling}}
    if(kh)hide(kh);
    anchor.parentNode.insertBefore(el,anchor);home.setAttribute('data-kfp','1');return true;
  }
  var tries=0;(function tick(){if(build()||++tries>60)return;setTimeout(tick,300)})();
})();

/* v70: accessibility helpers (skip link, unique link names, labels, Nepali UI labels) */
(function(){
  var NE={'Nepali':'नेपाली','Science':'विज्ञान','History':'इतिहास','Literature':'साहित्य','Poetry':'कविता','Photos':'तस्बिर','Sumer':'सुमेर','Britain':'बेलायत','Organisms':'जीवजन्तु','Cancer':'क्यान्सर','Books':'किताब','Movies':'चलचित्र','Songs':'गीत','Series':'शृङ्खला','Archive':'अभिलेख'};
  var isNe=function(){return (document.documentElement.getAttribute('lang')||'').indexOf('ne')===0};
  function txt(e){return (e.textContent||'').replace(/\s+/g,' ').trim()}
  function skip(){
    if(document.querySelector('.kskip'))return;
    var m=document.querySelector('main,[role=main],.post-head,article,#kview');if(!m)return;
    if(!m.id)m.id='kmain';m.setAttribute('tabindex','-1');
    var a=document.createElement('a');a.className='kskip';a.href='#'+m.id;a.textContent=isNe()?'मुख्य सामग्रीमा जानुहोस्':'Skip to main content';
    a.addEventListener('click',function(){try{m.focus()}catch(e){}});
    document.body.insertBefore(a,document.body.firstChild);
  }
  function names(){
    document.querySelectorAll('.kafka-item').forEach(function(it){
      var h=it.querySelector('h3');var t=h?txt(h):'';if(!t)return;
      it.querySelectorAll('a').forEach(function(a){
        if(a.getAttribute('aria-label')||a.getAttribute('aria-hidden')==='true')return;
        var s=txt(a)||a.getAttribute('title')||'';if(!s)return;
        a.setAttribute('aria-label',s.replace(/\s*›\s*$/,'')+': '+t);
      });
    });
    document.querySelectorAll('button[aria-label="Previous"],button[aria-label="More"],button[aria-label="Next"]').forEach(function(b){
      var sec=b.closest('section,.kshelf,.kafka-list,[data-list]');var h=sec&&sec.querySelector('h2,h3');
      if(h&&!b.getAttribute('data-ka')){b.setAttribute('aria-label',b.getAttribute('aria-label')+' – '+txt(h));b.setAttribute('data-ka','1')}
    });
    document.querySelectorAll('a.kmore-link,a.kser-card,a.kn-card').forEach(function(a){
      if(txt(a)||a.getAttribute('aria-label'))return;
      var t=a.getAttribute('title')||(a.querySelector('img')&&a.querySelector('img').alt)||a.getAttribute('href');a.setAttribute('aria-label',t);
    });
    document.querySelectorAll('audio:not([aria-label])').forEach(function(a){
      var h=a.closest('.kpg-play');var t=h&&h.querySelector('.kf-t');a.setAttribute('aria-label','Audio player'+(t?': '+txt(t):''));
    });
  }
  function nepali(){
    if(!isNe())return;
    document.querySelectorAll('.tabs-items a,.knav-sticky a').forEach(function(a){
      var s=txt(a);if(NE[s]&&!a.getAttribute('data-ne')){a.textContent=NE[s];a.setAttribute('data-ne','1')}
    });
    document.querySelectorAll('input[type=search],input[name=q]').forEach(function(i){if(/search/i.test(i.placeholder||'')&&!i.getAttribute('data-ne')){i.placeholder='खोज्नुहोस्…';i.setAttribute('data-ne','1')}});
  }
  var t=0;function all(){try{skip();names();nepali()}catch(e){}}
  function go(){all();if(window.MutationObserver){new MutationObserver(function(){if(t)return;t=setTimeout(function(){t=0;all()},150)}).observe(document.body,{childList:true,subtree:true})}setTimeout(all,1500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

/* v71: one click opens the item page. Hover still shows the note; a tap or click anywhere on the card goes to its page. */
(function(){
  function link(it){return it.querySelector('.kafka-item-read a[href],.kafka-item-more a[href]')}
  document.addEventListener('click',function(e){
    var it=e.target.closest&&e.target.closest('.kafka-item');if(!it)return;
    if(e.target.closest('a,button,input,select,textarea,audio,summary'))return;
    if(e.defaultPrevented||e.button>0)return;
    var a=link(it);if(!a)return;
    e.preventDefault();e.stopPropagation();
    if(e.ctrlKey||e.metaKey||e.shiftKey)window.open(a.href,'_blank');else window.location.href=a.href;
  },true);
  function mark(){document.querySelectorAll('.kafka-item').forEach(function(it){if(link(it)&&!it.getAttribute('data-k1')){it.setAttribute('data-k1','1');it.style.cursor='pointer';if(it.getAttribute('tabindex')==='0')it.setAttribute('tabindex','-1')}})}
  function go(){mark();if(window.MutationObserver)new MutationObserver(function(){clearTimeout(go._t);go._t=setTimeout(mark,120)}).observe(document.body,{childList:true,subtree:true});setTimeout(mark,1500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

/* v89 photo captions */
(function(){
 var HOME=["Times Square towers through a dark frame","Times Square at night, steam and crowds","A Midtown avenue looking up toward the towers","Billboards leaning into the dark","A tour bus below the screens","\u201cKeep moving\u201d: a man with a sign, in black and white","A courier cycling beneath the billboards, in black and white","A scooter rider against green and teal light","A crowd on the street, in black and white"];
 function add(host,txt){ if(!host||!txt||host.querySelector('.kcap'))return; var s=document.createElement('span'); s.className='kcap'; s.textContent=txt; host.appendChild(s); var im=host.querySelector('img'); if(im&&(!im.alt||/^Photograph by/i.test(im.alt)))im.alt=txt; host.setAttribute('title',txt); var b=host.querySelector('button'); if(b)b.setAttribute('aria-label','Open photo: '+txt); }
 function run(){
  var g=document.getElementById('kafka-gallery');
  if(g){ [].forEach.call(g.querySelectorAll('li'),function(li,i){ add(li,HOME[i]); }); }
  [].forEach.call(document.querySelectorAll('.kphotos .kgrid a'),function(a){ var im=a.querySelector('img'); add(a,im&&im.alt); });
 }
 var tries=0; (function wait(){ run(); if(++tries<20)setTimeout(wait,500); })();
 document.addEventListener('touchstart',function(e){ var t=e.target.closest&&e.target.closest('#kafka-gallery li,.kphotos .kgrid a'); if(!t)return; t.classList.add('kcap-on'); clearTimeout(t._kc); t._kc=setTimeout(function(){t.classList.remove('kcap-on')},2600); },{passive:true});
 /* caption inside the full-size viewer */
 var dlg=document.getElementById('kafka-viewer');
 if(dlg){ var im=dlg.querySelector('img'); var cap=document.createElement('p'); cap.className='kv-cap'; dlg.appendChild(cap);
  var upd=function(){ var n=dlg.querySelector('.v-n'); var k=n?parseInt(n.textContent,10)-1:-1; cap.textContent=HOME[k]||''; };
  if(window.MutationObserver&&im)new MutationObserver(upd).observe(im,{attributes:true,attributeFilter:['src']});
 }
})();

/* v93 lead tile for Most read / Most recent */
(function(){
 function mark(){[].forEach.call(document.querySelectorAll('.sec-h'),function(h){
  if(!/most read|most recent/i.test(h.textContent||''))return;
  var s=h.nextElementSibling;while(s&&!s.classList.contains('kxs3')&&s!==h.parentElement.lastElementChild)s=s.nextElementSibling;
  if(s&&s.classList.contains('kxs3')&&!s.hasAttribute('data-lead')){s.setAttribute('data-lead','1');s.__kxu&&s.__kxu()}})}
 [300,1200,2500,5000,9000].forEach(function(t){setTimeout(mark,t)});mark();
})();

/* v96 series card extra text + part chips */
(function(){function f(){var m=document.querySelector('.kx-fp .fp-main');if(!m||m.__x)return;var parts=document.querySelectorAll('.kx-fp .fp-part');if(!parts.length)return;m.__x=1;var mb=m.querySelector('.fp-mb');if(!mb)return;
 var sm=[].map.call(parts,function(p){var s=p.querySelector('small');return s?s.textContent.trim():''}).filter(Boolean).join(' ');
 var d=document.createElement('span');d.className='fp-ms';d.textContent=sm;mb.appendChild(d);
 var c=document.createElement('span');c.className='fp-mc';[].forEach.call(parts,function(p,i){var a=document.createElement('span');a.textContent=(p.querySelector('em')?p.querySelector('em').textContent:'भाग '+(i+1))+' ›';a.setAttribute('data-href',p.href);c.appendChild(a)});mb.appendChild(c);
 c.addEventListener('click',function(e){var t=e.target.closest('[data-href]');if(t){e.preventDefault();e.stopPropagation();location.href=t.getAttribute('data-href')}});}
 [200,1200,3000,6000].forEach(function(t){setTimeout(f,t)});f();})();

/* v98 author logo + name on every post tile */
(function(){
 var AV='';
 function av(){if(AV)return AV;var i=document.querySelector('.hero .portrait img,.portrait img,.kn-about img');if(i&&i.src)AV=i.src;else{var p=document.querySelector('.hero .portrait');if(p){var m=/url\(["']?([^"')]+)/.exec(getComputedStyle(p).backgroundImage||'');if(m)AV=m[1]}}return AV}
 function run(){var a=av();[].forEach.call(document.querySelectorAll('.kxs3>.kx-tile .kx-tx'),function(tx){
  if(tx.querySelector('.kx-meta'))return;var d=tx.querySelector('p.d');var m=document.createElement('div');m.className='kx-meta';
  if(d){tx.insertBefore(m,d);m.appendChild(d)}else tx.appendChild(m);
  var b=document.createElement('span');b.className='kx-by';b.innerHTML=(a?'<img alt="" src="'+a+'">':'')+'<span>बासभ</span>';m.appendChild(b)})}
 var t;function sched(){clearTimeout(t);t=setTimeout(run,150)}
 run();[500,1500,3500,7000].forEach(function(x){setTimeout(run,x)});
 if(window.MutationObserver)new MutationObserver(sched).observe(document.body,{childList:true,subtree:true});
})();

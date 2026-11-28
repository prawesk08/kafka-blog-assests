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
      var L=series?[['base','Part 1 first'],['rev','Latest part first']]:[['base','Newest first'],['rev','Oldest first']];
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
    var parts=[];if(t)parts.push(t);if(m)parts.push(m+' tracks');
    if(!parts.length)return;
    if(!by)return;var p=document.createElement('span');p.className='kafka-item-line';p.textContent=parts.join(' \u00b7 ');by.appendChild(p);
  })}
  line();document.addEventListener('DOMContentLoaded',line);window.addEventListener('load',line);setTimeout(line,1200);
})();

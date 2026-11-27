/* kafka-collections.js v2
   1. gives each list block (ol.klist, ol.kser-items rows, article.kcard) its featured photo as --kbg, for the blurred photo canvas
   2. series carousel cards on post pages (.kser-deck .kser-card) get --kbg the same way
   3. post header: Share (opens on tap), Listen and the बासभ follow box in one row of one panel
   4. Photos page: numbered section heads, captions on the prints, lightbox
   5. About page: portrait card, lead, pull quote, topic cards, callouts
   6. post rows (ol.kser-items on category/series/literature pages, article.kcard on home/label/search pages):
      moves the number out of the photo into its own column, splits "Title: Subtitle" so the two get different type,
      and marks Devanagari titles/subtitles with .kt-ne (the li lang attribute is not reliable) */
(function(){
  var DEV=/[ऀ-ॿ]/;
  function paint(root){
    [].forEach.call((root||document).querySelectorAll('ol.klist>li, ol.kser-items>li, article.kcard'),function(el){
      if(el.getAttribute('data-kbg'))return; var img=el.querySelector('img'); if(!img)return;
      var src=img.currentSrc||img.getAttribute('src'); if(!src||/^data:/.test(src))return;
      var v='url("'+src.replace(/"/g,'%22')+'")'; el.style.setProperty('--kbg',v); el.setAttribute('data-kbg','1');
      var pic=el.querySelector('a.pic'); if(pic)pic.style.setProperty('--kbg',v);
    });
  }
  /* series carousel cards on post pages: tint from the card's own photo */
  function deck(root){
    [].forEach.call((root||document).querySelectorAll('.kser-deck .kser-card'),function(c){
      if(c.getAttribute('data-kbg'))return; var img=c.querySelector('.kser-thumb img'); if(!img)return;
      var src=img.currentSrc||img.getAttribute('src'); if(!src||/^data:/.test(src))return;
      c.style.setProperty('--kbg','url("'+src.replace(/"/g,'%22')+'")'); c.setAttribute('data-kbg','1');
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
    var kf=row.querySelector('.kfollow');if(kf&&!kf.querySelector('.kf-face')){var f=document.createElement('img');f.className='kf-face';f.alt='';f.width=34;f.height=34;f.loading='lazy';f.src='https://assets.kafka.blog/basava-priest-king-400.jpg';kf.insertBefore(f,kf.firstChild)}
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
      a.style.setProperty('--kbg','url("'+src.replace(/"/g,'%22')+'")'); a.classList.add('has-kbg');
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
    hero.innerHTML='<img class="kab-face" alt="बासभ (Basava)" src="https://assets.kafka.blog/basava-priest-king-400.jpg"><div><h2 class="kab-name">बासभ <span>Basava, writing as @naharchowck</span></h2><div class="kab-roles"><span>Immunotherapy</span><span>Molecular biology</span><span>Occasional writer</span><span>Occasional photographer</span></div><div class="kab-so"></div></div>';
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
  function startTint(){[].forEach.call(document.querySelectorAll('.kstart5>a.k5:not([data-kt])'),function(a){var s=a.querySelector('.k5-img');var m=s&&(s.getAttribute('style')||'').match(/url\((['"]?)(.*?)\1\)/);if(!m)return;a.setAttribute('data-kt','1');a.style.setProperty('--kbg','url("'+m[2].replace(/"/g,'%22')+'")')})}
  function all(){paint();rows();deck();heroTint();onerow();gallery();about();soften();caps();listNotes();tagWheel();serCounts();startTint();danda()}
  var t=0;
  function go(){all();if(window.MutationObserver){new MutationObserver(function(){if(t)return;t=setTimeout(function(){t=0;all()},60)}).observe(document.body,{childList:true,subtree:true})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

/* kafka-collections.js v2
   1. gives each list block (ol.klist, ol.kser-items rows, article.kcard) its featured photo as --kbg, for the blurred photo canvas
   2. series carousel cards on post pages (.kser-deck .kser-card) get --kbg the same way
   3. post header: Share (opens on tap), Listen and the बासभ follow box in one row of one panel
   4. post rows (ol.kser-items on category/series/literature pages, article.kcard on home/label/search pages):
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
    var lbl=sh.querySelector('.lbl'); if(!lbl||lbl.getAttribute('data-k1'))return; lbl.setAttribute('data-k1','1');
    lbl.setAttribute('role','button');lbl.setAttribute('tabindex','0');lbl.setAttribute('aria-expanded','false');
    function set(o){sh.classList.toggle('is-open',o);lbl.setAttribute('aria-expanded',o?'true':'false')}
    lbl.addEventListener('click',function(e){e.preventDefault();set(!sh.classList.contains('is-open'))});
    lbl.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();set(!sh.classList.contains('is-open'))}});
    document.addEventListener('click',function(e){if(!sh.contains(e.target))set(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
  }
  function all(){paint();rows();deck();onerow()}
  var t=0;
  function go(){all();if(window.MutationObserver){new MutationObserver(function(){if(t)return;t=setTimeout(function(){t=0;all()},60)}).observe(document.body,{childList:true,subtree:true})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

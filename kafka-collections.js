/* kafka-collections.js v2
   1. gives each small list card (sidebar/footer ol.klist) its featured photo as --kbg, for the blurred photo canvas
   2. post rows (ol.kser-items on category/series/literature pages, article.kcard on home/label/search pages):
      moves the number out of the photo into its own column, splits "Title: Subtitle" so the two get different type,
      and marks Devanagari titles/subtitles with .kt-ne (the li lang attribute is not reliable) */
(function(){
  var DEV=/[ऀ-ॿ]/;
  function paint(root){
    [].forEach.call((root||document).querySelectorAll('ol.klist>li'),function(el){
      if(el.getAttribute('data-kbg'))return; var img=el.querySelector('img'); if(!img)return;
      var src=img.currentSrc||img.getAttribute('src'); if(!src||/^data:/.test(src))return;
      var v='url("'+src.replace(/"/g,'%22')+'")'; el.style.setProperty('--kbg',v); el.setAttribute('data-kbg','1');
      var pic=el.querySelector('a.pic'); if(pic)pic.style.setProperty('--kbg',v);
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
  function all(){paint();rows()}
  var t=0;
  function go(){all();if(window.MutationObserver){new MutationObserver(function(){if(t)return;t=setTimeout(function(){t=0;all()},60)}).observe(document.body,{childList:true,subtree:true})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

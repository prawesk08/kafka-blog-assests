/* kafka-collections.js v1: gives each list card its featured photo as --kbg, so the card canvas (a blurred copy) takes the photo's own colours */
(function(){
  function paint(root){
    [].forEach.call((root||document).querySelectorAll('ol.kser-items>li .kser-pic, ol.klist>li, article.kcard'),function(el){
      if(el.getAttribute('data-kbg'))return; var img=el.querySelector('img'); if(!img)return;
      var src=img.currentSrc||img.getAttribute('src'); if(!src||/^data:/.test(src))return;
      var v='url("'+src.replace(/"/g,'%22')+'")'; el.style.setProperty('--kbg',v); el.setAttribute('data-kbg','1');
      var pic=el.querySelector('a.pic'); if(pic)pic.style.setProperty('--kbg',v);
    });
  }
  function go(){paint();if(window.MutationObserver){new MutationObserver(function(){paint()}).observe(document.body,{childList:true,subtree:true})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

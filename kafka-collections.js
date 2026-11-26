/* kafka-collections.js v1: gives each list card its featured photo as --kbg, so the card canvas (a blurred copy) takes the photo's own colours */
(function(){
  function paint(root){
    [].forEach.call((root||document).querySelectorAll('ol.kser-items>li'),function(li){
      var pic=li.querySelector('.kser-pic'),img=pic&&pic.querySelector('img'); if(!img||pic.getAttribute('data-kbg'))return;
      var src=img.currentSrc||img.getAttribute('src'); if(!src)return;
      pic.style.setProperty('--kbg','url("'+src.replace(/"/g,'%22')+'")'); pic.setAttribute('data-kbg','1');
    });
  }
  function go(){paint();if(window.MutationObserver){new MutationObserver(function(){paint()}).observe(document.body,{childList:true,subtree:true})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

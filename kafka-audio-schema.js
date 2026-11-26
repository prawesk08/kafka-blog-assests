/* Adds schema.org AudioObject JSON-LD for a post's narration, from audio.kafka.blog/manifest.json. */
(function(){
  try{
    var p=location.pathname;
    if(!/^\/\d{4}\/\d{2}\/.+\.html$/.test(p))return;
    fetch("https://audio.kafka.blog/manifest.json").then(function(r){return r.ok?r.json():null}).then(function(m){
      var e=m&&m[p];if(!e)return;
      function iso(s){s=Math.round(s);var h=Math.floor(s/3600),mi=Math.floor(s%3600/60),se=s%60;
        return"PT"+(h?h+"H":"")+(mi?mi+"M":"")+(se||!(h||mi)?se+"S":"")}
      var h1=document.querySelector("h1"),title=(h1&&h1.textContent||document.title).trim();
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

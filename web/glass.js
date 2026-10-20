(function(){
  'use strict';
  var image=new Image(),queued=false,ready=false;
  function update(){
    queued=false;if(!ready||document.hidden)return;
    var width=window.innerWidth,height=window.innerHeight;
    /* Match .wallpaper's cover crop and centred 1.015 scale. */
    var scale=Math.max(width/image.naturalWidth,height/image.naturalHeight)*1.015;
    var sceneWidth=image.naturalWidth*scale,sceneHeight=image.naturalHeight*scale;
    Array.prototype.forEach.call(document.querySelectorAll('.glass'),function(panel){
      var rect=panel.getBoundingClientRect();if(!rect.width||!rect.height)return;
      var key=[width,height,rect.left,rect.top].join(':');if(panel.dataset.glassGeometry===key)return;panel.dataset.glassGeometry=key;
      panel.style.setProperty('--glass-scene-width',sceneWidth+'px');
      panel.style.setProperty('--glass-scene-height',sceneHeight+'px');
      panel.style.setProperty('--glass-scene-x',((width-sceneWidth)/2-rect.left+28)+'px');
      panel.style.setProperty('--glass-scene-y',((height-sceneHeight)/2-rect.top+28)+'px');
      panel.classList.add('glass-ready');
    });
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  image.onload=function(){ready=true;schedule();};image.src='assets/alpine.png';
  window.addEventListener('resize',schedule);
  document.addEventListener('visibilitychange',function(){if(!document.hidden){if(window.HomeLifecycle)HomeLifecycle.defer(schedule,120);else schedule();}});
  function panelMotionEnded(event){if(event.target.classList&&event.target.classList.contains('glass'))schedule();}
  document.addEventListener('animationend',panelMotionEnded,true);
  document.addEventListener('transitionend',panelMotionEnded,true);
  /* Visibility and layout change when a panel or All apps opens; no polling. */
  new MutationObserver(function(records){
    if(records.some(function(record){return record.attributeName==='hidden'||record.attributeName==='class'&&record.target===document.body;}))schedule();
  }).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','class']});
})();

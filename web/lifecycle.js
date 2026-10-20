(function(){
  'use strict';
  var jobs=[],cycle=0,painted=false,hiddenHandlers=[],resumedHandlers=[];
  function later(task,delay){
    var generation=cycle,job={frame:0,timer:0};jobs.push(job);
    function done(){var i=jobs.indexOf(job);if(i>=0)jobs.splice(i,1);}
    job.frame=requestAnimationFrame(function(){job.timer=setTimeout(function(){done();if(generation===cycle&&!document.hidden)task();},delay===undefined?180:delay);});
  }
  function cancel(){jobs.forEach(function(job){if(job.frame)cancelAnimationFrame(job.frame);if(job.timer)clearTimeout(job.timer);});jobs=[];}
  var metrics={bootedAt:Date.now(),resumes:0,lastResumePaintMs:null};
  function visible(){
    cycle++;cancel();document.body.classList.remove('home-hidden');document.body.classList.add('home-resuming');
    var started=performance.now();requestAnimationFrame(function(){requestAnimationFrame(function(){if(document.hidden)return;metrics.lastResumePaintMs=Math.round(performance.now()-started);document.body.classList.remove('home-resuming');painted=true;});});
    resumedHandlers.forEach(function(task){task();});
  }
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){cycle++;cancel();document.body.classList.add('home-hidden');hiddenHandlers.forEach(function(task){task();});}
    else{metrics.resumes++;visible();}
  });
  window.HomeLifecycle={defer:later,onHidden:function(task){hiddenHandlers.push(task);},onResume:function(task){resumedHandlers.push(task);},metrics:metrics,hasPainted:function(){return painted;}};
  if(document.hidden)document.body.classList.add('home-hidden');else visible();
})();

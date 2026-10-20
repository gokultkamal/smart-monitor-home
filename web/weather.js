(function(){
  'use strict';
  var endpoint='https://api.open-meteo.com/v1/forecast?latitude=12.97194&longitude=77.59369&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata&forecast_days=1&timeformat=unixtime';
  var card=document.getElementById('weather'),temp=document.getElementById('weather-temperature'),condition=document.getElementById('weather-condition'),range=document.getElementById('weather-range'),symbol=document.getElementById('weather-symbol'),busy=false,lastGood=null,activeController=null,lastRefresh=0;
  var sun='<circle cx="20" cy="19" r="8" fill="#ffcf68"/><g stroke="#ffcf68" stroke-width="2.4" stroke-linecap="round"><path d="M20 5V2M20 36v-3M6 19H3M37 19h-3M10 9 8 7M32 31l-2-2M10 29l-2 2M32 7l-2 2"/></g>';
  var moon='<path d="M29 4c-12-1-22 12-16 24 5 11 20 13 28 2C25 35 17 17 29 4Z" fill="#e7eefb"/>';
  var cloud='<path d="M13 36a9 9 0 1 1 2-18 12 12 0 0 1 23 4 7 7 0 0 1-1 14Z" fill="#f3f7fc"/><path d="M13 36h24" stroke="#c3d3e3" stroke-width="2" stroke-linecap="round"/>';
  function describe(code,day){
    if(code===0)return {text:day?'Clear skies':'Clear night',kind:day?'sun':'moon'};
    if(code===1||code===2)return {text:code===1?'Mostly clear':'Partly cloudy',kind:day?'partly':'mooncloud'};
    if(code===3)return {text:'Overcast',kind:'cloud'};
    if(code===45||code===48)return {text:'Foggy',kind:'fog'};
    if(code>=51&&code<=57)return {text:'Drizzle',kind:'rain'};
    if(code>=61&&code<=67)return {text:'Rain',kind:'rain'};
    if(code>=71&&code<=77)return {text:'Snow',kind:'snow'};
    if(code>=80&&code<=82)return {text:'Rain showers',kind:'rain'};
    if(code===85||code===86)return {text:'Snow showers',kind:'snow'};
    if(code>=95&&code<=99)return {text:'Thunderstorms',kind:'storm'};
    return {text:'Current conditions',kind:'cloud'};
  }
  function draw(kind){var art=kind==='sun'?sun:kind==='moon'?moon:kind==='partly'?'<g transform="translate(1 -3) scale(.8)">'+sun+'</g>'+cloud:kind==='mooncloud'?moon+cloud:cloud;
    if(kind==='rain')art+='<path d="m17 41-2 4m12-4-2 4m12-4-2 4" stroke="#7bc8f8" stroke-width="2.4" stroke-linecap="round"/>';
    if(kind==='snow')art+='<g fill="#d9edff"><circle cx="17" cy="43" r="1.6"/><circle cx="27" cy="44" r="1.6"/><circle cx="37" cy="43" r="1.6"/></g>';
    if(kind==='fog')art+='<path d="M9 41h29M15 45h20" stroke="#cad9e3" stroke-width="2.4" stroke-linecap="round"/>';
    if(kind==='storm')art+='<path d="m27 33-7 9h6l-3 7 13-12h-8l3-4Z" fill="#ffd675"/>';
    symbol.innerHTML='<svg viewBox="0 0 48 50" aria-hidden="true">'+art+'</svg>';
  }
  function valid(d){return d&&d.current&&typeof d.current.temperature_2m==='number'&&isFinite(d.current.temperature_2m)&&typeof d.current.weather_code==='number'&&typeof d.current.time==='number'&&d.daily&&Array.isArray(d.daily.temperature_2m_max)&&typeof d.daily.temperature_2m_max[0]==='number'&&Array.isArray(d.daily.temperature_2m_min)&&typeof d.daily.temperature_2m_min[0]==='number';}
  function show(d,failed){var c=d.current,info=describe(c.weather_code,c.is_day),age=Date.now()-c.time*1000;temp.textContent=Math.round(c.temperature_2m)+'°';condition.textContent=info.text;draw(info.kind);
    var stale=age>45*60*1000;card.classList.toggle('weather-stale',!!failed||stale);card.classList.remove('weather-loading');
    var observed=new Date(c.time*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Kolkata'});
    range.textContent=(failed||stale)?'Updated '+observed+' · Tap to retry':'H:'+Math.round(d.daily.temperature_2m_max[0])+'°  L:'+Math.round(d.daily.temperature_2m_min[0])+'°';
    card.title='Bangalore · '+info.text+' · '+Math.round(c.temperature_2m)+'°C. Updated '+observed+' IST. Weather by Open-Meteo. Select to refresh.';
    card.setAttribute('aria-label',card.title);card.dataset.state=failed||stale?'cached':'current';
  }
  function unavailable(){temp.textContent='—';condition.textContent='Weather unavailable';range.textContent='Select to retry';draw('cloud');card.classList.remove('weather-loading');card.dataset.state='unavailable';card.setAttribute('aria-label','Bangalore weather unavailable. Select to retry.');}
  function refresh(){if(busy)return;busy=true;card.setAttribute('aria-busy','true');var controller=typeof AbortController!=='undefined'?new AbortController():null;activeController=controller;var timeout=setTimeout(function(){if(controller)controller.abort();},9000);
    fetch(endpoint,controller?{signal:controller.signal,cache:'no-store'}:{cache:'no-store'}).then(function(r){if(!r.ok)throw Error('Weather service unavailable');return r.json();}).then(function(d){if(!valid(d))throw Error('Incomplete weather');lastGood=d;lastRefresh=Date.now();try{localStorage.setItem('home.weather.bangalore',JSON.stringify(d));}catch(e){}show(d,false);}).catch(function(){if(document.hidden)return;if(lastGood)show(lastGood,true);else unavailable();}).then(function(){clearTimeout(timeout);busy=false;activeController=null;card.setAttribute('aria-busy','false');});
  }
  try{var cached=JSON.parse(localStorage.getItem('home.weather.bangalore'));if(valid(cached)&&Date.now()-cached.current.time*1000<6*60*60*1000){lastGood=cached;show(cached,true);}}catch(e){}
  if(!lastGood){draw('partly');condition.textContent='Fetching weather';range.textContent='Bangalore, India';}
  function automatic(){if(document.hidden||lastRefresh&&Date.now()-lastRefresh<15*60*1000)return;refresh();}
  function deferred(){if(window.HomeLifecycle)HomeLifecycle.defer(automatic,700);else automatic();}
  card.onclick=refresh;window.addEventListener('online',deferred);document.addEventListener('visibilitychange',function(){if(document.hidden){if(activeController)activeController.abort();}else deferred();});deferred();setInterval(automatic,15*60*1000);
})();

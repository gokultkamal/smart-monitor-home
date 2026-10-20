(function(){
 'use strict';
 var now=new Date(),year=now.getFullYear(),month=now.getMonth(),browsing=false,lastDay=now.toDateString();
 var card=document.getElementById('calendar'),grid=document.getElementById('calendar-days'),heading=document.getElementById('calendar-month');
 function render(){var today=new Date(),first=new Date(year,month,1),offset=(first.getDay()+6)%7,count=new Date(year,month+1,0).getDate(),previous=new Date(year,month,0).getDate();heading.textContent=first.toLocaleDateString('en-IN',{month:'long',year:'numeric'});heading.setAttribute('aria-label',heading.textContent+'. Return to this month');grid.textContent='';var cells=Math.ceil((offset+count)/7)*7;
  for(var i=0;i<cells;i++){var day=i-offset+1,current=day>=1&&day<=count,cell=document.createElement('span');cell.className='calendar-day'+(current?'':' outside');cell.textContent=current?day:day<1?previous+day:day-count;if(current){var date=new Date(year,month,day);cell.setAttribute('aria-label',date.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));if(year===today.getFullYear()&&month===today.getMonth()&&day===today.getDate()){cell.className+=' today';cell.setAttribute('aria-current','date');}}else cell.setAttribute('aria-hidden','true');grid.appendChild(cell);}
  card.setAttribute('aria-label','Calendar, '+heading.textContent);
 }
 function move(amount){var target=new Date(year,month+amount,1);year=target.getFullYear();month=target.getMonth();browsing=true;render();}
 document.getElementById('calendar-prev').onclick=function(){move(-1);};document.getElementById('calendar-next').onclick=function(){move(1);};heading.onclick=function(){var today=new Date();year=today.getFullYear();month=today.getMonth();browsing=false;render();};
 setInterval(function(){if(document.hidden)return;var today=new Date();if(today.toDateString()!==lastDay){lastDay=today.toDateString();if(!browsing){year=today.getFullYear();month=today.getMonth();}render();}},60000);document.addEventListener('visibilitychange',function(){if(!document.hidden){var today=new Date();if(today.toDateString()===lastDay)return;lastDay=today.toDateString();if(!browsing){year=today.getFullYear();month=today.getMonth();}render();}});render();
})();

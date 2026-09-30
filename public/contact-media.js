(()=>{
 const playWhenAllowed=(video)=>{
   if(!video) return ()=>{};
   video.autoplay=true;
   video.loop=true;
   video.muted=true;
   video.defaultMuted=true;
   video.playsInline=true;
   ['autoplay','loop','muted','playsinline','webkit-playsinline'].forEach(attr=>video.setAttribute(attr,''));
   const play=()=>{
     if(document.visibilityState==='hidden') return;
     const promise=video.play();
     if(promise&&typeof promise.catch==='function') promise.catch(()=>{});
   };
   ['loadedmetadata','loadeddata','canplay'].forEach(event=>video.addEventListener(event,play,{passive:true}));
   if(video.readyState>=2) play();
   if('IntersectionObserver' in window){
     const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)play()}),{threshold:0.08});
     observer.observe(video);
   }
   window.addEventListener('pageshow',play,{passive:true});
   document.addEventListener('visibilitychange',()=>{if(!document.hidden)play()},{passive:true});
   ['touchstart','pointerdown','click'].forEach(event=>document.addEventListener(event,play,{once:true,passive:true}));
   return play;
 };

 const section=document.querySelector('#cfTalk');
 let fox=null;
 if(section){
   fox=section.querySelector('#cfFoxVideo');
   const bg=section.querySelector('#cfBgVideo');
   const sources=[[fox,'/assets/CreatorFox%20(4).mp4'],[bg,'https://creatorfox.com/wp-content/uploads/2026/09/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4']];
   sources.forEach(([video,url])=>{
     if(!video) return;
     const play=playWhenAllowed(video);
     video.poster='/assets/home/4f265906c4607fa9.png';
     video.src=url;
     video.addEventListener('loadeddata',()=>video.classList.add('cf-loaded'),{once:true});
     video.load();
     play();
   });
   const toggle=section.querySelector('#cfAudioToggle');
   const label=toggle?.querySelector('.cf-audio-label');
   const state=on=>{
     if(!toggle||!label) return;
     toggle.setAttribute('aria-pressed',String(on));
     toggle.setAttribute('aria-label',on?'Mute contact video sound':'Enable contact video sound');
     label.textContent=on?'Mute sound':'Enable sound';
   };
   if(toggle&&fox) toggle.addEventListener('click',async()=>{
     if(toggle.disabled) return;
     const on=fox.muted;
     toggle.disabled=true;
     try{
       fox.muted=!on;
       fox.volume=.8;
       if(on){
         label.textContent='Starting sound…';
         await Promise.race([fox.play(),new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),9000))]);
       }
       state(on);
     }catch{
       fox.muted=true;
       state(false);
       label.textContent='Tap to retry sound';
     }finally{toggle.disabled=false;}
   });
   document.addEventListener('visibilitychange',()=>{
     if(document.hidden&&fox&&toggle){fox.muted=true;state(false);}
   });
 }

 document.querySelectorAll('.cf-footer-bg').forEach(video=>{
   const play=playWhenAllowed(video);
   video.load();
   play();
 });

 document.querySelectorAll('[data-agenda]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-agenda]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('[data-agenda-panel]').forEach(x=>x.hidden=x.dataset.agendaPanel!==b.dataset.agenda)}));
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(!reduced)document.querySelectorAll('#cf-contact-widget .cf-form-panel').forEach(p=>{p.addEventListener('pointermove',e=>{const r=p.getBoundingClientRect();p.style.setProperty('--glow-x',((e.clientX-r.left)/r.width*100)+'%');p.style.setProperty('--glow-y',((e.clientY-r.top)/r.height*100)+'%')})});
})();

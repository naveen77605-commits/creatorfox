(()=>{
 const section=document.querySelector('#cfTalk');
 if(section){
 const fox=section.querySelector('#cfFoxVideo'),bg=section.querySelector('#cfBgVideo'),toggle=section.querySelector('#cfAudioToggle'),label=toggle?.querySelector('.cf-audio-label');
 const sources=[[fox,'https://creatorfox.com/wp-content/uploads/2026/03/Untitled-design-6.mp4'],[bg,'https://creatorfox.com/wp-content/uploads/2026/09/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4']];
 sources.forEach(([v,url])=>{if(!v)return;v.muted=true;v.defaultMuted=true;v.playsInline=true;v.poster='/assets/home/4f265906c4607fa9.png';v.src=url;v.addEventListener('loadeddata',()=>v.classList.add('cf-loaded'));v.play().catch(()=>{})});
 function state(on){toggle.setAttribute('aria-pressed',String(on));toggle.setAttribute('aria-label',on?'Mute contact video sound':'Enable contact video sound');label.textContent=on?'Mute sound':'Enable sound'}
 if(toggle&&fox)toggle.addEventListener('click',async()=>{if(toggle.disabled)return;const on=fox.muted;toggle.disabled=true;try{fox.muted=!on;fox.volume=.8;if(on){label.textContent='Starting sound…';await Promise.race([fox.play(),new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),9000))])}state(on)}catch{fox.muted=true;state(false);label.textContent='Tap to retry sound'}finally{toggle.disabled=false}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&fox&&toggle){fox.muted=true;state(false)}});
 }
 document.querySelectorAll('[data-agenda]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-agenda]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('[data-agenda-panel]').forEach(x=>x.hidden=x.dataset.agendaPanel!==b.dataset.agenda)}));
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(!reduced)document.querySelectorAll('#cf-contact-widget .cf-form-panel').forEach(p=>{p.addEventListener('pointermove',e=>{const r=p.getBoundingClientRect();p.style.setProperty('--glow-x',((e.clientX-r.left)/r.width*100)+'%');p.style.setProperty('--glow-y',((e.clientY-r.top)/r.height*100)+'%')})});
})();

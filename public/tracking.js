(()=>{
 let config,enabled=false,choice=null;
 try{choice=localStorage.getItem('cfx-measurement')}catch{}
 function activate(){
  if(enabled||!config||!(config.ga||config.ads))return;enabled=true;
  window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};
  gtag('js',new Date());
  // Keep enquiry content and URL query strings out of measurement payloads.
  const page=location.origin+location.pathname;
  if(config.ga)gtag('config',config.ga,{page_location:page,allow_google_signals:false,allow_ad_personalization_signals:false});
  if(config.ads)gtag('config',config.ads,{page_location:page,allow_ad_personalization_signals:false});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(config.ga||config.ads);document.head.append(script);
 }
 function choose(value){choice=value;try{localStorage.setItem('cfx-measurement',value)}catch{}document.querySelector('#cf-measurement-choice')?.remove();if(value==='allow')activate();else if(enabled)location.reload()}
 function show(){
  if(document.querySelector('#cf-measurement-choice'))return;
  const box=document.createElement('section');box.id='cf-measurement-choice';box.setAttribute('aria-label','Measurement preferences');box.style.cssText='position:fixed;z-index:99999;bottom:110px;left:16px;max-width:390px;width:calc(100% - 32px);padding:20px;background:#f5f0e6;color:#17130f;border:1px solid #BC6F10;border-radius:16px;box-shadow:0 8px 40px #0006;font:15px/1.5 sans-serif';
  const p=document.createElement('p');p.textContent='Allow optional analytics and advertising measurement? This helps us understand visits and successful enquiries.';box.append(p);
  for(const [text,value] of [['Allow measurement','allow'],['Decline','deny']]){const b=document.createElement('button');b.type='button';b.textContent=text;b.style.cssText='background:#17130f;color:#fff;border:0;border-radius:8px;padding:10px 14px;margin:8px 8px 0 0;cursor:pointer';b.onclick=()=>choose(value);box.append(b)}
  const a=document.createElement('a');a.href='/privacy';a.textContent='Privacy notice';a.style.cssText='display:block;color:#17130f;margin-top:10px;text-decoration:underline';box.append(a);document.body.append(box);
 }
 let sent=false;
 document.addEventListener('creatorfox:enquiry-accepted',event=>{
  if(!enabled||sent)return;sent=true;
  const params={service:String(event.detail?.service||'general'),page_location:location.origin+location.pathname};
  if(config.ga)gtag('event','generate_lead',{...params,send_to:config.ga});
  if(config.ads&&config.label)gtag('event','conversion',{...params,send_to:config.ads+'/'+config.label,transaction_id:crypto.randomUUID()});
 });
 fetch('/tracking-config.json').then(r=>r.ok?r.json():null).then(c=>{
  config=c;if(!config||!(config.ga||config.ads))return;
  const b=document.createElement('button');b.type='button';b.textContent='Privacy choices';b.style.cssText='background:transparent;color:inherit;border:1px solid currentColor;border-radius:6px;padding:8px 12px;margin:16px;cursor:pointer';b.onclick=show;(document.querySelector('footer')||document.body).append(b);
  if(choice==='allow')activate();else if(choice!=='deny')show();
 }).catch(()=>{});
})();

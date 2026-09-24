(()=>{
 const form=document.getElementById('cfNewsletter'),status=document.getElementById('cfNewsletterStatus');if(!form||!status)return;
 const button=form.querySelector('[type=submit]');let busy=false,last=0;const started=Date.now();
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy||!form.reportValidity())return;
  if(form.elements._honey.value)return;
  if(Date.now()-started<1500||Date.now()-last<30000){status.textContent='Please wait a moment before sending.';return}
  busy=true;button.disabled=true;status.textContent='Sending your subscription request…';
  try{
   const r=await fetch('https://formsubmit.co/ajax/make.creatorfox@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({email:form.elements.email.value.trim(),_subject:'CreatorFox newsletter subscription',message:'Please subscribe this email address to The Letter from CreatorFox.',source:location.origin+location.pathname}),signal:AbortSignal.timeout(20000)});
   const data=await r.json();if(!r.ok||!(data.success===true||data.success==='true'))throw Error('unconfirmed');
   last=Date.now();status.textContent='Your subscription request was accepted for processing. Thank you.';form.reset();
  }catch{
   status.replaceChildren(document.createTextNode('We couldn’t confirm delivery. '));const link=document.createElement('a');link.textContent='Request by email';link.href='mailto:make.creatorfox@gmail.com?subject=CreatorFox%20newsletter&body='+encodeURIComponent('Please subscribe '+form.elements.email.value.trim()+' to The Letter.');status.append(link);
  }finally{busy=false;button.disabled=false}
 });
})();

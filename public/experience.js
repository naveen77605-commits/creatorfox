(()=>{
const form=document.querySelector('#cfContactForm,#enquiry');
const bar=document.createElement('div');bar.className='cf-bottom-bar cf-discuss-bar';
bar.innerHTML='<button type="button" aria-expanded="false" aria-controls="cf-discuss"><span class="cf-fox-wave" aria-hidden="true">🦊</span> Let’s discuss <span aria-hidden="true">↗</span></button>';document.body.append(bar);
const panel=document.createElement('section');panel.id='cf-discuss';panel.hidden=true;panel.className='cf-discuss-panel';panel.setAttribute('aria-label','Contact CreatorFox');
panel.innerHTML='<header><strong>Your next move starts here.</strong><button type="button" aria-label="Close contact options">×</button></header><p>Have a brief or prefer a conversation? Choose what works for you.</p><a class="cf-discuss-option" href="'+(form?'#'+form.id:'/contact')+'"><strong>Submit a form ↗</strong><span>Tell us about your business and what you need.</span></a><a class="cf-discuss-option" href="#cf-booking" aria-haspopup="dialog"><strong>Book a meet ↗</strong><span>Choose a time and book right here.</span></a>';document.body.append(panel);
const toggle=bar.querySelector('button');function open(value){panel.hidden=!value;toggle.setAttribute('aria-expanded',String(value));(value?panel.querySelector('a'):toggle).focus();}
toggle.onclick=()=>open(panel.hidden);panel.querySelector('header button').onclick=()=>open(false);panel.querySelector('a').addEventListener('click',()=>open(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)open(false)});
document.addEventListener('click',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!bar.contains(e.target))open(false)});



// Cal.com element-click embed supplied by CreatorFox.
(function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["initNamespace",namespace])}else p(cal,ar);return}p(cal,ar)}})(window,"https://app.cal.com/embed/embed.js","init");
window.Cal("init","30min",{origin:"https://app.cal.com"});
window.Cal.config=window.Cal.config||{};
window.Cal.config.forwardQueryParams=true;
window.Cal.ns["30min"]("ui",{hideEventTypeDetails:false,layout:"month_view"});
const bookLink=panel.querySelector('[href="#cf-booking"]');
bookLink.setAttribute('data-cal-link','creator-ai/30min');
bookLink.setAttribute('data-cal-namespace','30min');
bookLink.setAttribute('data-cal-config',JSON.stringify({layout:"month_view",useSlotsViewOnSmallScreen:"true"}));
bookLink.addEventListener('click',event=>{event.preventDefault();panel.hidden=true;toggle.setAttribute('aria-expanded','false');});

const section=document.querySelector('#case-studies');
if(section){
section.innerHTML=section.innerHTML;
section.querySelector('.cf-section-kicker').textContent='Case studies / service by service';
section.querySelector('#case-title').textContent='The goal. The approach. The difference.';
section.querySelector('.cf-section-copy').textContent='Explore how CreatorFox approaches real business challenges across branding, websites, marketing and AI.';
section.querySelector('.cf-case-disclaimer').textContent='Client-context examples: these service plans describe proposed approaches and intended outcomes. Completed scope and performance results require client approval before publication.';
const cases=[
['The Common Good','Brand kit','Bring every experience into one story.','Connect the café, handloom store and workshops through a consistent identity. CreatorFox’s proposed approach covers positioning, offer hierarchy, menu and social templates so customers understand what makes the space worth visiting.','A clearer brand','Track brand recall and consistent rollout.','photo-1441986300917-64674bd600d8'],
['Baggage Transporter','Website development','Make the next step obvious.','Present shipping categories, explain pickup requirements and connect visitors to a courier-cost enquiry. The website approach uses clear navigation, mobile calls to action and a WhatsApp handover to reduce friction between interest and enquiry.','Simpler enquiries','Track completed enquiries and mobile conversion.','photo-1566576912321-d58ddd7a6088'],
['NDS Eco Motors','AI content marketing','Turn product strengths into useful stories.','Build content around range, everyday journeys and ownership questions. CreatorFox’s proposed content plan combines real scooter footage, founder explanations and edited short videos, with reviewed AI-assisted scripts and a clear test-ride call to action.','More informed buyers','Track video retention and test-ride enquiries.','photo-1558981806-ec527fa84c39'],
['Hiranmayee Interiors','Performance marketing','Reach homeowners who fit the brief.','Focus landing-page messages and campaigns on the service area, project type and customer budget. CreatorFox’s proposed approach connects local creative, qualification questions and campaign reviews to the consultations the business can actually serve.','Better-fit leads','Track service-area match and consultation rate.','photo-1600210492486-724fe5c67fb0'],
['The Common Good','Influencer marketing','Let local voices introduce the experience.','Match Bengaluru creators to café, shopping and workshop audiences. Plan visits, agree reel and story deliverables, clarify disclosures and track campaign links or offer codes. The goal is neighbourhood discovery that can be connected to visits.','Local discovery','Track qualified enquiries and attributable visits.','photo-1501339847302-ac426a4a7cbb'],
['Dr Patel Dental','AEO / GEO','Help patients find clear local answers.','Organise location information, treatment FAQs and appointment calls to action. CreatorFox’s proposed approach uses practitioner-reviewed information and accurate business details so potential patients can understand services and decide whether to enquire.','Clearer discovery','Track relevant search visits and appointment enquiries.','photo-1629909613654-28e377c37b09'],
['Parth Rasayan','Automation & AI agents','Route product enquiries to the right team.','A proposed workflow captures product requirements, categorises the enquiry and prepares a structured handover. An approved knowledge source can support draft answers, while technical specifications, commercial terms and final replies remain subject to human review.','Faster handovers','Compare response time and manual effort.','photo-1581092921461-eab62e97a780'],
['CreatorFox team learning','AI workshop','Leave with a workflow, not just inspiration.','Bring a real campaign or repetitive task into a guided session. Teams practise briefing, prompting, checking outputs and documenting a reusable process. A named owner then runs a 30-day pilot with agreed quality and time-saving measures.','Practical adoption','Measure pilot usage, time saved and output quality.','photo-1522071820081-009f0129c71c'],
['Alphi Interiors','Digital / AI consulting','Connect marketing to the sales follow-up.','Map the journey from campaign click to consultation and proposal. CreatorFox’s proposed plan identifies gaps in lead capture, ownership and follow-up, then prioritises a manageable pilot before adding more tools or expanding spend.','A connected process','Track response time and enquiry-to-consultation rate.','photo-1497366754035-f200968a6e72']
];
const scroll=section.querySelector('.cf-case-scroll');
let active=-1,queued=false;
function render(index){if(index===active)return;active=index;const c=cases[index];const set=(id,value)=>section.querySelector('#'+id).textContent=value;
set('cfCaseIndex',String(index+1).padStart(2,'0')+' / 09');set('cfCaseClient',c[0]);set('cfCaseTitle',c[2]);set('cfCaseDescription',c[3]);set('cfCaseCategory',c[1]);set('cfCaseMetric',c[4]);set('cfCaseMetricLabel',c[5]);
section.querySelector('#cfCaseBrand').textContent='Service approach · India';
section.querySelector('#cfCaseTags').textContent=c[1]+' / Client-context example';
const image=section.querySelector('#cfCaseImage');image.src='https://images.unsplash.com/'+c[6]+'?auto=format&fit=crop&w=1200&q=80';image.alt='Illustrative setting for '+c[1];
}
function update(){queued=false;const rect=scroll.getBoundingClientRect();const span=Math.max(1,scroll.offsetHeight-window.innerHeight+100);render(Math.min(8,Math.max(0,Math.floor((100-rect.top)/span*9))));}
window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});window.addEventListener('resize',update);update();
}
})();
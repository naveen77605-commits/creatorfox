import fs from 'node:fs';
import crypto from 'node:crypto';
import services from '../data/services.json' with {type:'json'};
const origin='https://www.creatorfox.com';
const entries={
 '/':['AI Agency in Bengaluru | Marketing & Automation','CreatorFox is an AI agency in Bengaluru for branding, websites, AI content marketing, performance marketing and automation. Discuss your business goals.'],
 '/services':['AI & Digital Marketing Services in Bengaluru','Explore CreatorFox services: branding, 3D websites, AI content, paid ads, influencers, AEO/GEO, AI agents, team workshops and digital consulting.'],
 '/services/brand-kit':['Branding Agency in Bengaluru | Brand Kits','Build a consistent brand with CreatorFox. Get positioning, logo design, colours, typography, brand guidelines and templates your team can use.'],
 '/services/3d-website-development':['3D Website Development & Web Design Agency','CreatorFox designs responsive websites with purposeful 3D interactions, clear copy, technical SEO and a simple enquiry journey for your customers.'],
 '/services/content-marketing':['AI Content Marketing & Video Production Agency','Plan content that explains your business. Explore CreatorFox AI video and content packages, professional video shoots, editorial strategy and social content.'],
 '/services/performance-marketing':['Performance Marketing Agency | Google & Meta Ads','CreatorFox connects Google, Meta and LinkedIn ads with landing pages, conversion tracking and creative testing. Build a measurable lead generation plan.'],
 '/services/influencer-marketing':['Influencer Marketing Agency in India','Find creators who fit your audience. CreatorFox handles influencer shortlists, campaign briefs, content approvals, usage rights and performance reporting.'],
 '/services/aeo-geo':['AEO & GEO Agency | AI Search Optimisation','Improve how search engines and AI answer tools understand your business with CreatorFox AEO, GEO, structured data and answer-focused content services.'],
 '/services/automation-ai-agents':['AI Agents & Business Automation Agency','Reduce repetitive work with CreatorFox AI agents and automation. Explore lead routing, support assistants, proposal workflows and tool integrations.'],
 '/services/ai-workshop':['Practical AI Workshops for Business Teams','Book a hands-on CreatorFox AI workshop for founders, marketing and operations teams. Practise real tasks and leave with prompts and a 30-day action plan.'],
 '/services/digital-ai-consulting':['Digital & AI Consulting for Business Growth','Get a practical AI adoption roadmap from CreatorFox. Review customer journeys, tools and workflows, then prioritise the changes your business needs.'],
 '/industries':['AI & Digital Marketing Solutions by Industry','Explore CreatorFox solutions for ecommerce, real estate, healthcare, hospitality, B2B and education: websites, marketing, content and AI automation.'],
 '/about':['About CreatorFox | Independent AI & Creative Agency','Meet CreatorFox, an independent Bengaluru AI and creative agency led by Naveen Kumar. Discover our approach to branding, marketing and practical AI.'],
 '/contact':['Contact CreatorFox | Discuss Your Business Goals','Contact CreatorFox about branding, websites, marketing, automation or AI workshops. Share your brief or book a discovery meeting with our team.'],
 '/careers':['Careers at CreatorFox | Design, Video & Internships','Explore graphic design, video editing and internship opportunities at CreatorFox. Share your portfolio and tell us how you want to grow with the team.'],
 '/privacy':['Privacy Notice','Learn how CreatorFox handles website enquiries, newsletter requests, service providers and optional analytics. Contact us about your personal information.'],
 '/404':['Page Not Found','Explore CreatorFox AI, branding and digital marketing services or contact our team.']
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function applySEO(root){
 const ga=(process.env.GOOGLE_ANALYTICS_ID||'').trim(),ads=(process.env.GOOGLE_ADS_ID||'').trim(),label=(process.env.GOOGLE_ADS_CONVERSION_LABEL||'').trim(),verification=(process.env.GOOGLE_SITE_VERIFICATION||'').trim();
 for(const [name,value,pattern] of [['GOOGLE_ANALYTICS_ID',ga,/^G-[A-Z0-9]+$/],['GOOGLE_ADS_ID',ads,/^AW-\d+$/],['GOOGLE_ADS_CONVERSION_LABEL',label,/^[\w-]+$/],['GOOGLE_SITE_VERIFICATION',verification,/^[\w-]+$/]])if(value&&!pattern.test(value))throw new Error(`Invalid ${name}`);
 if(label&&!ads)throw new Error('GOOGLE_ADS_CONVERSION_LABEL requires GOOGLE_ADS_ID');
 fs.writeFileSync(root+'/tracking-config.json',JSON.stringify({ga,ads,label}));
 const hashes=[];
 for(const [path,[title,description]] of Object.entries(entries)){
 const file=root+(path==='/'?'':path)+'/index.html';if(!fs.existsSync(file))continue;
 let html=fs.readFileSync(file,'utf8');const url=origin+(path==='/'?'/':path),fullTitle=title+' | CreatorFox';
 html=html.replace(/<title>[\s\S]*?<\/title>/i,'').replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi,'').replace(/<meta\b[^>]*(?:name|property)=["'](?:description|keywords|robots|google-site-verification|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi,'').replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,'');
 const organization={'@type':'Organization','@id':origin+'/#organization',name:'CreatorFox',url:origin+'/',logo:origin+'/favicon.png',email:'make@creatorfox.com'};
 const graph=[organization,{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'CreatorFox',publisher:{'@id':organization['@id']}},{'@type':path==='/about'?'AboutPage':path==='/contact'?'ContactPage':'WebPage','@id':url+'#page',url,name:fullTitle,description,isPartOf:{'@id':origin+'/#website'},inLanguage:'en-IN'}];
 const service=services.find(s=>path==='/services/'+s.slug);
 if(service)graph.push({'@type':'Service',name:service.name,description,url,serviceType:service.name,provider:{'@id':organization['@id']}});
 if(path!=='/'&&path!=='/404')graph.push({'@type':'BreadcrumbList',itemListElement:[{name:'Home',item:origin+'/'},...(service?[{name:'Services',item:origin+'/services'}]:[]),{name:service?.name||title.split('|')[0].trim(),item:url}].map((x,i)=>({'@type':'ListItem',position:i+1,...x}))});
 const json=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');hashes.push("'sha256-"+crypto.createHash('sha256').update(json).digest('base64')+"'");
 html=html.replace('</head>',`<title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${path==='/404'?'noindex,follow':'index,follow,max-image-preview:large'}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="CreatorFox"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/assets/asset-3.webp"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${origin}/assets/asset-3.webp">${verification?`<meta name="google-site-verification" content="${esc(verification)}">`:''}<script type="application/ld+json">${json}</script><script src="/tracking.js" defer></script></head>`);
 if(path==='/privacy')html=html.replace('<h2>Retention and requests</h2>','<h2>Optional measurement</h2><p>When configured, Google Analytics helps us understand page visits and successful enquiries. Google Ads measures accepted enquiry submissions after your choice to allow measurement. These tools can use cookies and device information. Enquiry names, email addresses and message content are not sent in our measurement events. Use “Privacy choices” in the footer to change your preference.</p><h2>Retention and requests</h2>');
 fs.writeFileSync(file,html);
 }
 fs.copyFileSync(root+'/404/index.html',root+'/404.html');
 fs.writeFileSync(root+'/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(entries).filter(p=>p!='/404').map(p=>`<url><loc>${origin}${p==='/'?'/':p}</loc></url>`).join('')}</urlset>`);
 fs.writeFileSync(root+'/robots.txt',`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`);
 // JSON-LD is inert data; keep its hashes permitted under the existing strict policy.
 const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));for(const rule of config.headers||[])for(const h of rule.headers||[])if(h.key.toLowerCase()==='content-security-policy')h.value=h.value.replace('script-src ',`script-src ${hashes.filter(hash=>!h.value.includes(hash)).join(' ')} `);
 fs.writeFileSync('vercel.json',JSON.stringify(config,null,2)+'\n');
 console.log(`SEO: ${Object.keys(entries).length} pages; Google tags ${ga||ads?'configured':'awaiting IDs'}`);
}

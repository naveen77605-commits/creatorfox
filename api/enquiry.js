import {validate,limited,hash,redis} from '../lib/security.mjs';
import {makeProposal} from '../lib/proposal.mjs';
import services from '../data/services.json' with {type:'json'};

const memory=new Map();
function localLimited(key,max,windowMs){const now=Date.now(),hit=memory.get(key);if(!hit||now-hit.start>windowMs){memory.set(key,{start:now,count:1});return false}hit.count+=1;return hit.count>max}
async function rate(key,max,seconds){if(process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN)return limited(key,max,seconds);return localLimited(key,max,seconds*1000)}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'})}
  if(!process.env.RESEND_API_KEY||!process.env.PROPOSAL_FROM_EMAIL)return res.status(503).json({error:'Proposal email delivery is not configured yet.'});
  const origin=String(process.env.SITE_URL||'').replace(/\/$/,'');if(origin&&req.headers.origin&&req.headers.origin!==origin)return res.status(403).json({error:'Please submit through our website.'});
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'Invalid request format.'});
  let b=req.body;if(typeof b==='string'){try{b=JSON.parse(b)}catch{return res.status(400).json({error:'Invalid request.'})}}
  if(!b||typeof b!=='object'||JSON.stringify(b).length>12000)return res.status(413).json({error:'Your message is too long.'});
  if(b.website_confirm||b._gotcha)return res.status(400).json({error:'Please complete the form again.'});
  b={...b,consent:b.consent===true||b.consent==='true'||b.consent==='on'};const error=validate(b);if(error)return res.status(400).json({error});
  const ip=String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();if(await rate('cfx:ip:'+hash(ip),8,3600))return res.status(429).json({error:'Too many requests. Please try again later.'});
  if(process.env.TURNSTILE_SECRET_KEY){if(typeof b.token!=='string'||b.token.length>2048)return res.status(400).json({error:'Please complete the verification.'});const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY,response:b.token,remoteip:ip}),signal:AbortSignal.timeout(7000)});const checked=await verify.json();if(!checked.success||origin&&checked.hostname!==new URL(origin).hostname)return res.status(400).json({error:'Verification expired. Please try again.'})}
  if(await rate('cfx:email:'+hash(b.email.toLowerCase()),3,86400))return res.status(429).json({error:'A proposal was recently requested for this address. Please email us for further help.'});
  const id=hash(b.email.toLowerCase()+b.service+Math.floor(Date.now()/86400000));
  try{if(process.env.UPSTASH_REDIS_REST_URL&&!(await redis('SET','cfx:lock:'+id,'1','EX',90,'NX')))return res.status(409).json({error:'Your request is already being processed. Please check your inbox shortly.'});const service=services.find(s=>s.slug===b.service);const pdf=await makeProposal(b);const owner=process.env.LEAD_NOTIFICATION_EMAIL||'make@creatorfox.com';const payload={from:process.env.PROPOSAL_FROM_EMAIL,to:[b.email],bcc:[owner],reply_to:owner,subject:`CreatorFox | Your ${service.name} starting proposal`,text:`Hello ${b.name},\n\nThank you for telling us about ${b.company}. Your ${service.name} starting proposal is attached.\n\nThis outlines a possible scope, not a final quote. We will review your requirements and follow up to confirm priorities, fees and timing.\n\nYour brief: ${b.goal}\nBudget: ${b.budget}\nTimeline: ${b.timeline}\nPhone: ${b.phone||'Not provided'}\n\nReply to this email with any questions.\n\nCreatorFox`,attachments:[{filename:`CreatorFox-${b.service}-proposal.pdf`,content:pdf.toString('base64')}]};const sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':id},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});if(!sent.ok)throw Error('Email provider rejected request');return res.status(200).json({message:'Your proposal PDF was accepted for delivery by the email provider and has been emailed to you. CreatorFox has also received your brief and will follow up after review.'})}catch(e){console.error('Enquiry processing failed:',e.name);return res.status(503).json({error:'We couldn’t confirm delivery. Please try again later or email make@creatorfox.com.'})}
}

import crypto from 'node:crypto';
import services from '../data/services.json' with {type:'json'};
export const required=['RESEND_API_KEY','PROPOSAL_FROM_EMAIL','TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','FORM_SIGNING_SECRET','SITE_URL'];
export function configured(){return required.every(k=>Boolean(process.env[k]))}
export function sign(t){return crypto.createHmac('sha256',process.env.FORM_SIGNING_SECRET).update(String(t)).digest('hex')}
export function validTime(t,s){if(!Number.isSafeInteger(t)||typeof s!=='string'||!/^[a-f0-9]{64}$/.test(s))return false;const age=Date.now()-t;if(age<3000||age>7200000)return false;return crypto.timingSafeEqual(Buffer.from(s,'hex'),Buffer.from(sign(t),'hex'))}
export function validate(b){
 if(!b||typeof b!=='object'||Array.isArray(b))return 'Invalid request.';
 const checks={name:[2,100],company:[1,120],email:[3,254],goal:[20,2000],phone:[0,30],budget:[0,100],timeline:[0,100]};
 for(const [k,[lo,hi]]of Object.entries(checks)){if(k==='phone'&&b[k]===undefined)continue;if(typeof b[k]!=='string'||b[k].trim().length<lo||b[k].length>hi||/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(b[k]))return 'Please check your '+k+'.'}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)||/[\r\n]/.test(b.email))return 'Please enter a valid email.';
 if(!services.some(s=>s.slug===b.service))return 'Please choose a service.';
 if(b.consent!==true)return 'Please agree to the privacy notice.';return null;
}
export async function redis(...command){const r=await fetch(process.env.UPSTASH_REDIS_REST_URL,{method:'POST',headers:{Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(command),signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error('Rate limit unavailable');const out=await r.json();if(out.error)throw Error('Rate limit unavailable');return out.result}
export function hash(s){return crypto.createHash('sha256').update(s).digest('hex')}
export async function limited(key,max,seconds){const n=await redis('EVAL',"local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n;",1,key,seconds);return n>max}

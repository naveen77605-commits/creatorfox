"use client";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, BadgeCheck, Bot, BrainCircuit, ChartNoAxesCombined, Globe2, PenTool, Sparkles, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services=[
 {slug:"brand-identity",no:"01",title:"Brand Identity",kicker:"Make the brand unmistakable.",copy:"Positioning, verbal direction and a visual system built to create recognition across every touchpoint.",image:"https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=88",icon:Sparkles},
 {slug:"website-development",no:"02",title:"Website Development",kicker:"Turn attention into action.",copy:"Premium digital experiences with conversion architecture, motion, SEO foundations and a content system that scales.",image:"https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=88",icon:Globe2},
 {slug:"content-strategy",no:"03",title:"Content Strategy",kicker:"Build a publishing engine.",copy:"A clear content system across social, video, thought leadership and campaigns — designed around the audience and offer.",image:"https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=88",icon:PenTool},
 {slug:"performance-marketing",no:"04",title:"Performance Marketing",kicker:"Spend with a reason.",copy:"Google, Meta and LinkedIn acquisition systems with creative testing, landing pages, tracking and relentless optimization.",image:"https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=88",icon:ChartNoAxesCombined},
 {slug:"creator-marketing",no:"05",title:"Creator Marketing",kicker:"Borrow attention. Keep trust.",copy:"Indian creator discovery, negotiation and campaign execution built around audience fit, not vanity follower counts.",image:"https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=88",icon:Users},
 {slug:"ai-automation",no:"06",title:"AI & Automation",kicker:"Make repetitive work disappear.",copy:"Agents and workflows that connect your forms, CRM, inbox, reporting and operations into a faster operating layer.",image:"https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=88",icon:Bot},
 {slug:"ai-workshops",no:"07",title:"Executive AI Workshops",kicker:"Make AI practical.",copy:"Hands-on AI adoption for founders and teams — from useful prompting to workflow design and automation opportunities.",image:"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=88",icon:BrainCircuit}
];

export default function ServicesShowcase(){
 const root=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{const ctx=gsap.context(()=>{
   const cards=gsap.utils.toArray<HTMLElement>(".service-panel");
   cards.forEach((card,i)=>{
     const image=card.querySelector(".service-image");
     const copy=card.querySelector(".service-copy");
     const media=card.querySelector(".service-media");
     const number=card.querySelector(".service-number");
     gsap.fromTo(card,{clipPath:"inset(12% 0 12% 0)",y:80},{clipPath:"inset(0% 0 0% 0)",y:0,ease:"power3.out",duration:1.1,scrollTrigger:{trigger:card,start:"top 82%",end:"top 30%",scrub:1}});
     gsap.fromTo(image,{scale:1.22,xPercent:i%2?5:-5},{scale:1,xPercent:0,ease:"none",scrollTrigger:{trigger:card,start:"top bottom",end:"bottom top",scrub:1.2}});
     gsap.fromTo(copy,{y:90,opacity:0},{y:0,opacity:1,ease:"power3.out",duration:1,scrollTrigger:{trigger:card,start:"top 72%",toggleActions:"play none none reverse"}});
     gsap.fromTo(number,{y:70,opacity:0},{y:0,opacity:1,ease:"power3.out",duration:.9,scrollTrigger:{trigger:card,start:"top 78%",toggleActions:"play none none reverse"}});
     gsap.to(media,{yPercent:i%2?-7:7,ease:"none",scrollTrigger:{trigger:card,start:"top bottom",end:"bottom top",scrub:1.5}});
   });
   gsap.utils.toArray<HTMLElement>(".services-heading-word").forEach((el,i)=>gsap.fromTo(el,{y:120,opacity:0},{y:0,opacity:1,ease:"power4.out",duration:1,delay:i*.05,scrollTrigger:{trigger:el,start:"top 88%",toggleActions:"play none none reverse"}}));
   ScrollTrigger.refresh();
 },root);return()=>ctx.revert()},[]);
 return <section ref={root} className="bg-[#11110f] text-white">
   <div className="mx-auto max-w-[1440px] px-5 pt-24 sm:px-8 sm:pt-36">
     <div className="grid gap-8 pb-20 lg:grid-cols-[.8fr_1.2fr] lg:items-end sm:pb-28">
       <div><p className="eyebrow text-[#BB7C1D]">The CreatorFox stack</p><h2 className="mt-6 overflow-hidden text-5xl font-bold leading-[.88] tracking-[-.065em] sm:text-8xl"><span className="services-heading-word inline-block">Seven</span> <span className="services-heading-word inline-block text-[#BB7C1D]">ways</span><br/><span className="services-heading-word inline-block">to move</span><br/><span className="services-heading-word inline-block">faster.</span></h2></div>
       <div className="lg:pl-20"><p className="max-w-xl text-base leading-8 text-white/45">No disconnected vendors. No generic retainers. Each capability plugs into the same growth system — brand creates demand, digital converts it, creators distribute it, media scales it and AI compounds the operation.</p><div className="mt-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/30"><span className="h-px w-12 bg-[#BB7C1D]"/> Scroll to explore</div></div>
     </div>
   </div>
   <div className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-40">
    <div className="space-y-7 sm:space-y-10">{services.map((s,i)=>{const Icon=s.icon;return <article key={s.slug} className="service-panel relative min-h-[650px] overflow-hidden rounded-[30px] border border-white/10 bg-[#191917] sm:min-h-[720px] lg:min-h-[760px]">
      <div className="service-media absolute inset-0 overflow-hidden"><img className="service-image h-[115%] w-full object-cover opacity-[.82]" src={s.image} alt={s.title}/><div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/15"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"/></div>
      <div className="relative flex min-h-[650px] flex-col justify-between p-6 sm:min-h-[720px] sm:p-10 lg:min-h-[760px] lg:p-14">
       <div className="flex items-start justify-between"><span className="service-number text-[clamp(4rem,9vw,9rem)] font-bold leading-none tracking-[-.08em] text-white/10">{s.no}</span><span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/20 backdrop-blur-md"><Icon size={20} className="text-[#BB7C1D]" strokeWidth={1.4}/></span></div>
       <div className="service-copy max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#BB7C1D]">{s.kicker}</p><h3 className="mt-4 text-5xl font-bold leading-[.9] tracking-[-.06em] sm:text-7xl lg:text-8xl">{s.title}</h3><p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">{s.copy}</p><Link href={`/services/${s.slug}`} className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#2B2B2B] transition hover:bg-[#BB7C1D] hover:text-white">Explore service <span className="grid h-6 w-6 place-items-center rounded-full bg-black/10 group-hover:rotate-45"><ArrowUpRight size={13}/></span></Link></div>
      </div>
     </article>})}</div>
   </div>
 </section>
}

import { NextResponse } from "next/server";

const repo=process.env.GITHUB_REPO||"naveen77605-commits/creatorfox";
const path="content/site.json";

export async function POST(req:Request){
  try{
    const password=req.headers.get("x-admin-password");
    if(!process.env.ADMIN_PASSWORD||password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:"Unauthorized"},{status:401});
    if(!process.env.GITHUB_TOKEN)return NextResponse.json({error:"GITHUB_TOKEN is not configured on Vercel."},{status:503});
    const body=await req.json();
    const encoded=Buffer.from(JSON.stringify(body,null,2)+"\n").toString("base64");
    const headers={Authorization:`Bearer ${process.env.GITHUB_TOKEN}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"};
    const current=await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=main`,{headers,cache:"no-store"});
    if(!current.ok)return NextResponse.json({error:"Could not read the current content file from GitHub."},{status:502});
    const file=await current.json();
    const update=await fetch(`https://api.github.com/repos/${repo}/contents/${path}`,{method:"PUT",headers,body:JSON.stringify({message:"Update CreatorFox content from dashboard",content:encoded,sha:file.sha,branch:"main"})});
    if(!update.ok){const detail=await update.text();return NextResponse.json({error:"GitHub update failed",detail},{status:502});}
    return NextResponse.json({ok:true,message:"Published to GitHub. Vercel will rebuild from the new content."});
  }catch(error){return NextResponse.json({error:"Unexpected publish error",detail:String(error)},{status:500});}
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata={metadataBase:new URL("https://creatorfox.com"),title:{default:"CreatorFox — Growth. Creative. AI.",template:"%s — CreatorFox"},description:"CreatorFox is a premium growth studio, Indian creator marketplace and AI automation partner for ambitious brands.",keywords:["CreatorFox","digital marketing agency India","creator marketplace India","performance marketing","website development","AI automation","influencer marketing India"],openGraph:{title:"CreatorFox — Growth. Creative. AI.",description:"Build a brand people remember. Scale it with performance, creators and AI.",url:"https://creatorfox.com",siteName:"CreatorFox",type:"website"},twitter:{card:"summary_large_image",title:"CreatorFox — Growth. Creative. AI.",description:"Premium growth, creator marketing and AI automation."},robots:{index:true,follow:true}};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className="noise">{children}</body></html>}

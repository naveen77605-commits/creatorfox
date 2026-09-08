"use client";

export default function Logo({dark=false,className=""}:{dark?:boolean;className?:string}){
  return <div className={`inline-flex items-center gap-2 ${dark?"rounded-xl bg-[#f7f7f5] px-3 py-2":""} ${className}`} aria-label="CreatorFox">
    <svg width="190" height="48" viewBox="0 0 190 48" role="img" aria-label="CreatorFox logo" className="h-auto w-[145px] sm:w-[175px]">
      <text x="0" y="35" fill={dark?"#2B2B2B":"currentColor"} fontFamily="Manrope, Arial, sans-serif" fontSize="31" fontWeight="500" letterSpacing="0.4">Creator</text>
      <text x="91" y="35" fill="#BB7C1D" fontFamily="Manrope, Arial, sans-serif" fontSize="31" fontWeight="500">F</text>
      <circle cx="130" cy="24" r="18" fill="none" stroke="#BB7C1D" strokeWidth="2.6"/>
      <path d="M119 25l3-11 8 5 8-5 3 11-11 9-11-9Z" fill="#BB7C1D"/>
      <path d="M126 31l4-8 4 8" fill="#BB7C1D"/>
      <text x="151" y="35" fill="#BB7C1D" fontFamily="Manrope, Arial, sans-serif" fontSize="31" fontWeight="500">x</text>
    </svg>
  </div>
}

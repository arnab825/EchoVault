"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentRoute, setCurrentRoute] = useState(pathname);

  useEffect(() => {
    setCurrentRoute(pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div key={currentRoute} className="page-transition w-full min-h-full relative">
      {/* Editorial route flare indicator */}
      <div 
        key={`flare-${currentRoute}`} 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent z-50 pointer-events-none opacity-80 animate-pulse-glow" 
      />
      {children}
    </div>
  );
}


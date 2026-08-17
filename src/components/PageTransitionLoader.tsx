"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip initial page load so first render is fast and direct
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Trigger brand mini-loader on route change (Mobile Only)
    setLoading(true);

    // Keep brand loader visible for 800ms for a clear, premium transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    // lg:hidden ensures loader ONLY shows on mobile/tablet phone screens
    <div className="lg:hidden fixed inset-0 z-[9999] flex items-center justify-center bg-white/92 backdrop-blur-lg animate-fadeIn transition-all duration-300 font-sans pointer-events-none">
      {/* Large Brand Logo directly on Background (No Box Card, No Text) */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#0071E3]/12 animate-ping pointer-events-none" />
        <div className="w-32 h-32 sm:w-36 sm:h-36 relative z-10 flex items-center justify-center">
          <Image
            src="/moncradle-icon.png"
            alt="Moncradel"
            width={144}
            height={144}
            className="w-full h-full object-contain drop-shadow-sm"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}

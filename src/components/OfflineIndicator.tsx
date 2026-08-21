"use client";

import React, { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initial check when component mounts
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F8F9FA]/95 backdrop-blur-sm px-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center max-w-sm w-full border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="relative w-24 h-24 mb-6">
          {/* Using standard img tag to ensure it loads even if Next Image Optimization is blocked offline */}
          <img
            src="/moncradle-icon.png"
            alt="Moncradel Logo"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
        
        <div className="bg-rose-50 p-4 rounded-full mb-4 animate-pulse">
          <WifiOff className="w-8 h-8 text-rose-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">You are offline</h2>
        <p className="text-slate-500">
          Please check your internet connection. We'll automatically reconnect when you're back online.
        </p>
      </div>
    </div>
  );
}

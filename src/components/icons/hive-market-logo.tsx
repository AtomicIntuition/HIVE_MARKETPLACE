"use client";

import { cn } from "@/lib/utils";

interface HiveMarketLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function HiveMarketLogo({
  className,
  iconOnly = false,
}: HiveMarketLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-8 w-8 items-center justify-center">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
        >
          {/* Hexagon shape */}
          <path
            d="M16 2L28.124 9V23L16 30L3.876 23V9L16 2Z"
            fill="url(#hive-gradient)"
            stroke="url(#hive-stroke)"
            strokeWidth="1.5"
          />
          {/* Inner grid lines suggesting marketplace/network */}
          <path
            d="M16 9L22 12.5V19.5L16 23L10 19.5V12.5L16 9Z"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          <circle cx="16" cy="16" r="2.5" fill="white" fillOpacity="0.9" />
          <defs>
            <linearGradient
              id="hive-gradient"
              x1="3.876"
              y1="2"
              x2="28.124"
              y2="30"
            >
              <stop stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#6D28D9" />
            </linearGradient>
            <linearGradient
              id="hive-stroke"
              x1="3.876"
              y1="2"
              x2="28.124"
              y2="30"
            >
              <stop stopColor="#A78BFA" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {!iconOnly && (
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-foreground">Hive</span>
          <span className="text-lg font-semibold text-violet-400">Market</span>
        </div>
      )}
    </div>
  );
}

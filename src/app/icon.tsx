import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 2L28.66 9.5V24.5L16 32L3.34 24.5V9.5L16 2Z"
            fill="url(#grad)"
          />
          <path
            d="M16 8L22.93 12V20L16 24L9.07 20V12L16 8Z"
            fill="rgba(255,255,255,0.15)"
          />
          <path
            d="M16 12L19.46 14V18L16 20L12.54 18V14L16 12Z"
            fill="rgba(255,255,255,0.3)"
          />
          <defs>
            <linearGradient
              id="grad"
              x1="3.34"
              y1="2"
              x2="28.66"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#6D28D9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}

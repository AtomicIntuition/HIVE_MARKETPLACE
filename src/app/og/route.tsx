import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "";
  const description = searchParams.get("description") || "";
  const category = searchParams.get("category") || "";
  const rating = searchParams.get("rating") || "";

  // Default (homepage) OG
  if (!title) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            background: "linear-gradient(145deg, #0c0a1a 0%, #030712 40%, #0a0d14 100%)",
            fontFamily: "sans-serif",
          }}
        >
          {/* Content layer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "60px 80px",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Top: Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 2L28.66 9.5V24.5L16 32L3.34 24.5V9.5L16 2Z"
                  fill="#8B5CF6"
                />
                <path
                  d="M16 8L22.93 12V20L16 24L9.07 20V12L16 8Z"
                  fill="rgba(255,255,255,0.15)"
                />
                <path
                  d="M16 12L19.46 14V18L16 20L12.54 18V14L16 12Z"
                  fill="rgba(255,255,255,0.3)"
                />
              </svg>
              <span
                style={{
                  color: "#E5E7EB",
                  fontSize: "28px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Hive Market
              </span>
            </div>

            {/* Center: Headline + subtext */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "62px",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "#FFFFFF",
                }}
              >
                <span>The Marketplace for</span>
                <span>AI Agent Tools</span>
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#6B7280",
                  lineHeight: 1.4,
                }}
              >
                Discover, connect, and publish MCP tools for your AI agents
              </div>
            </div>

            {/* Bottom: Pills + domain */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  background: "rgba(139, 92, 246, 0.15)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "100px",
                  color: "#A78BFA",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                Free & Open
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  background: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "100px",
                  color: "#FBBF24",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                Browse & Publish
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "100px",
                  color: "#34D399",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                MCP Protocol
              </div>
              <div
                style={{
                  display: "flex",
                  marginLeft: "auto",
                  color: "#4B5563",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                hive-mcp.vercel.app
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Per-tool / per-page OG
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "linear-gradient(145deg, #0c0a1a 0%, #030712 40%, #0a0d14 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 80px",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Top: Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2L28.66 9.5V24.5L16 32L3.34 24.5V9.5L16 2Z"
                fill="#8B5CF6"
              />
              <path
                d="M16 8L22.93 12V20L16 24L9.07 20V12L16 8Z"
                fill="rgba(255,255,255,0.15)"
              />
            </svg>
            <span
              style={{
                color: "#9CA3AF",
                fontSize: "22px",
                fontWeight: 500,
              }}
            >
              Hive Market
            </span>
          </div>

          {/* Center: Title + description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                fontSize: "56px",
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  fontSize: "22px",
                  color: "#6B7280",
                  lineHeight: 1.4,
                }}
              >
                {description}
              </div>
            )}
          </div>

          {/* Bottom: Meta */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
            }}
          >
            {category && (
              <div
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  background: "rgba(139, 92, 246, 0.15)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "100px",
                  color: "#A78BFA",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                {category}
              </div>
            )}
            {rating && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#FBBF24",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                ★ {rating}
              </div>
            )}
            <div
              style={{
                display: "flex",
                marginLeft: "auto",
                color: "#4B5563",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              hive-mcp.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

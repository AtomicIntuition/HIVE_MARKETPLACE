import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Hive Market";
  const description =
    searchParams.get("description") ||
    "The marketplace for MCP-compatible tools for AI agents";
  const category = searchParams.get("category") || "";
  const rating = searchParams.get("rating") || "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #030712 0%, #111827 50%, #1e1b4b 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "white",
              }}
            />
          </div>
          <span style={{ color: "#F9FAFB", fontSize: "24px", fontWeight: 600 }}>
            Hive Market
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#F9FAFB",
            lineHeight: 1.1,
            marginBottom: "16px",
            maxWidth: "800px",
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "24px",
            color: "#9CA3AF",
            lineHeight: 1.4,
            maxWidth: "700px",
            marginBottom: "32px",
          }}
        >
          {description}
        </div>

        {/* Meta info */}
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {category && (
            <div
              style={{
                padding: "8px 16px",
                background: "rgba(139, 92, 246, 0.2)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "8px",
                color: "#A78BFA",
                fontSize: "18px",
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
                gap: "8px",
                color: "#F59E0B",
                fontSize: "18px",
              }}
            >
              ★ {rating}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

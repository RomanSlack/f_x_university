import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Is your degree worth it?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const year = new Date().getFullYear();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "3px solid black",
              backgroundColor: "white",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              fontWeight: 500,
              color: "#737373",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Degree Collapse
          </span>
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.1,
            color: "#111",
            maxWidth: "900px",
          }}
        >
          Is your degree worth it in {year}?
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#737373",
            marginTop: "24px",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Every major scored 0–100 on unemployment, AI risk, debt, and salary.
        </div>
      </div>
    ),
    { ...size }
  );
}

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
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "2.5px solid #111",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: "16px",
              fontWeight: 500,
              color: "#999",
              letterSpacing: "0.15em",
            }}
          >
            DEGREE COLLAPSE
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "80px",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#111",
              letterSpacing: "-0.02em",
            }}
          >
            {`Is your degree`}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "80px",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#111",
              letterSpacing: "-0.02em",
            }}
          >
            {`worth it in ${year}?`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "22px",
            color: "#888",
            marginTop: "32px",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          Every major and US university scored 0-100 on AI risk, debt, and employability.
        </div>
      </div>
    ),
    { ...size }
  );
}

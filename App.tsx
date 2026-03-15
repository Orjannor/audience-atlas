import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

type PlatformName =
  | "Schibsted"
  | "Amedia"
  | "Aller"
  | "TikTok"
  | "Facebook"
  | "Instagram"
  | "Meta"
  | "Snap";

type PeriodMode = "weekly" | "daily";

const population = 4_891_812;

const platformLabels: PlatformName[] = [
  "Schibsted",
  "Amedia",
  "Aller",
  "TikTok",
  "Facebook",
  "Instagram",
  "Meta",
  "Snap",
];

const colors: Record<PlatformName, string> = {
  Schibsted: "#F1F5F9",
  Amedia: "#2E7D32",
  Aller: "#6B7280",
  TikTok: "#FF2B2B",
  Facebook: "#3B82F6",
  Instagram: "#E879F9",
  Meta: "#CBD5E1",
  Snap: "#E5FF00",
};

const weeklyPercent: Record<PlatformName, number> = {
  Schibsted: 77.3,
  Amedia: 58.2,
  Aller: 47.0,
  TikTok: 27.4,
  Facebook: 78.0,
  Instagram: 61.1,
  Meta: 85.0,
  Snap: 72.3,
};

const dailyPercent: Record<PlatformName, number> = {
  Schibsted: 50.0,
  Amedia: 36.4,
  Aller: 24.0,
  TikTok: 23.5,
  Facebook: 68.8,
  Instagram: 51.6,
  Meta: 79.0,
  Snap: 67.6,
};

function formatPercent(v: number) {
  return `${v.toFixed(1).replace(".", ",")}%`;
}

export default function App() {
  const [periodMode, setPeriodMode] = useState<PeriodMode>("weekly");
  const [visiblePlatforms, setVisiblePlatforms] = useState<PlatformName[]>(["Schibsted"]);

  const togglePlatform = (platform: PlatformName) => {
    setVisiblePlatforms((current) => {
      if (current.includes(platform)) {
        if (current.length === 1) return current;
        return current.filter((p) => p !== platform);
      }
      return [...current, platform];
    });
  };

  const data = useMemo(() => {
    const source = periodMode === "weekly" ? weeklyPercent : dailyPercent;
    return platformLabels
      .filter((platform) => visiblePlatforms.includes(platform))
      .map((platform) => ({
        name: platform,
        value: source[platform],
      }))
      .sort((a, b) => b.value - a.value);
  }, [periodMode, visiblePlatforms]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071B67",
        color: "white",
        fontFamily: "Inter, Arial, sans-serif",
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Audience Atlas
          </div>
          <h1 style={{ margin: 0, fontSize: 42 }}>Audience Atlas Prototype</h1>
          <p style={{ marginTop: 8, color: "rgba(255,255,255,0.8)" }}>
            En enkel live-versjon for testing i Vercel.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ background: "rgba(255,255,255,0.96)", color: "#0f172a", borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Befolkning</div>
            <div style={{ fontSize: 40, fontWeight: 700 }}>{population.toLocaleString("nb-NO")}</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>Total Norge</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.96)", color: "#0f172a", borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
              Schibsted {periodMode === "weekly" ? "ukentlig" : "daglig"} dekning
            </div>
            <div style={{ fontSize: 40, fontWeight: 700 }}>
              {formatPercent(periodMode === "weekly" ? weeklyPercent.Schibsted : dailyPercent.Schibsted)}
            </div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>Live testversjon</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.96)", color: "#0f172a", borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Ledelse blant redaksjonelle</div>
            <div style={{ fontSize: 40, fontWeight: 700 }}>+19,1 pp</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>mot Amedia ukentlig</div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            color: "#0f172a",
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Visualisering</h2>
          <p style={{ color: "#64748b", marginTop: 0 }}>Velg kanaler og periode.</p>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Velg kanaler</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {platformLabels.map((platform) => {
                const active = visiblePlatforms.includes(platform);
                return (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    style={{
                      borderRadius: 999,
                      padding: "10px 14px",
                      border: active ? "1px solid #0f172a" : "1px solid #cbd5e1",
                      background: active ? "#0f172a" : "white",
                      color: active ? "white" : "#334155",
                      cursor: "pointer",
                    }}
                  >
                    {platform}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Periode</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setPeriodMode("daily")}
                style={{
                  borderRadius: 999,
                  padding: "10px 14px",
                  border: periodMode === "daily" ? "1px solid #0f172a" : "1px solid #cbd5e1",
                  background: periodMode === "daily" ? "#0f172a" : "white",
                  color: periodMode === "daily" ? "white" : "#334155",
                  cursor: "pointer",
                }}
              >
                Dag
              </button>
              <button
                onClick={() => setPeriodMode("weekly")}
                style={{
                  borderRadius: 999,
                  padding: "10px 14px",
                  border: periodMode === "weekly" ? "1px solid #0f172a" : "1px solid #cbd5e1",
                  background: periodMode === "weekly" ? "#0f172a" : "white",
                  color: periodMode === "weekly" ? "white" : "#334155",
                  cursor: "pointer",
                }}
              >
                Uke
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#0B237A",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: 24,
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Markedsoversikt total</h2>
          <p style={{ marginTop: 0, color: "rgba(255,255,255,0.8)" }}>
            {periodMode === "weekly" ? "Ukentlig" : "Daglig"} total dekning per plattform
          </p>
          <div style={{ width: "100%", height: 480 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "white" }}
                  tickFormatter={(v) => `${Math.round(Number(v))}%`}
                />
                <YAxis type="category" dataKey="name" tick={{ fill: "white" }} width={100} />
                <Tooltip formatter={(v: number) => formatPercent(v)} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={colors[entry.name as PlatformName]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  LineChart,
  Line,
  Legend,
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
type BreakdownMode = "generation" | "age";
type ViewMode = "market" | "generation" | "profile";

type GenerationName = "Gen Alpha" | "Gen Z" | "Millennials" | "Gen X" | "Boomers" | "Silent Gen";
type AgeGroupName = "12–14" | "15–19" | "20–29" | "30–39" | "40–49" | "50–59" | "60–69" | "70+";

type SeriesRow = { label: string } & Partial<Record<PlatformName, number>>;

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

const generationLabels: GenerationName[] = [
  "Gen Alpha",
  "Gen Z",
  "Millennials",
  "Gen X",
  "Boomers",
  "Silent Gen",
];

const ageLabels: AgeGroupName[] = ["12–14", "15–19", "20–29", "30–39", "40–49", "50–59", "60–69", "70+"];

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

const weeklyGenerationPercent: Record<PlatformName, Record<GenerationName, number>> = {
  Schibsted: { "Gen Alpha": 48, "Gen Z": 66, Millennials: 82, "Gen X": 85, Boomers: 76, "Silent Gen": 56 },
  Amedia: { "Gen Alpha": 15, "Gen Z": 31, Millennials: 61, "Gen X": 70, Boomers: 66, "Silent Gen": 48 },
  Aller: { "Gen Alpha": 29, "Gen Z": 30, Millennials: 46, "Gen X": 59, Boomers: 49, "Silent Gen": 28 },
  TikTok: { "Gen Alpha": 52, "Gen Z": 65, Millennials: 33, "Gen X": 17, Boomers: 5, "Silent Gen": 2 },
  Facebook: { "Gen Alpha": 41, "Gen Z": 69, Millennials: 85, "Gen X": 84, Boomers: 75, "Silent Gen": 60 },
  Instagram: { "Gen Alpha": 40, "Gen Z": 80, Millennials: 73, "Gen X": 60, Boomers: 39, "Silent Gen": 16 },
  Meta: { "Gen Alpha": 58, "Gen Z": 86, Millennials: 90, "Gen X": 89, Boomers: 78, "Silent Gen": 61 },
  Snap: { "Gen Alpha": 76, "Gen Z": 87, Millennials: 83, "Gen X": 73, Boomers: 51, "Silent Gen": 21 },
};

const dailyGenerationPercent: Record<PlatformName, Record<GenerationName, number>> = {
  Schibsted: { "Gen Alpha": 24, "Gen Z": 35, Millennials: 54, "Gen X": 60, Boomers: 49, "Silent Gen": 30 },
  Amedia: { "Gen Alpha": 6, "Gen Z": 15, Millennials: 37, "Gen X": 47, Boomers: 43, "Silent Gen": 28 },
  Aller: { "Gen Alpha": 13, "Gen Z": 12, Millennials: 24, "Gen X": 32, Boomers: 26, "Silent Gen": 14 },
  TikTok: { "Gen Alpha": 46, "Gen Z": 61, Millennials: 27, "Gen X": 13, Boomers: 3, "Silent Gen": 2 },
  Facebook: { "Gen Alpha": 29, "Gen Z": 52, Millennials: 75, "Gen X": 78, Boomers: 68, "Silent Gen": 52 },
  Instagram: { "Gen Alpha": 30, "Gen Z": 69, Millennials: 64, "Gen X": 50, Boomers: 31, "Silent Gen": 11 },
  Meta: { "Gen Alpha": 44, "Gen Z": 78, Millennials: 85, "Gen X": 84, Boomers: 72, "Silent Gen": 54 },
  Snap: { "Gen Alpha": 74, "Gen Z": 84, Millennials: 78, "Gen X": 67, Boomers: 46, "Silent Gen": 19 },
};

const weeklyAgePercent: Record<PlatformName, Record<AgeGroupName, number>> = {
  Schibsted: { "12–14": 50, "15–19": 56, "20–29": 74, "30–39": 82, "40–49": 86, "50–59": 85, "60–69": 81, "70+": 72 },
  Amedia: { "12–14": 14, "15–19": 18, "20–29": 47, "30–39": 62, "40–49": 68, "50–59": 71, "60–69": 67, "70+": 65 },
  Aller: { "12–14": 28, "15–19": 31, "20–29": 30, "30–39": 50, "40–49": 57, "50–59": 60, "60–69": 53, "70+": 45 },
  TikTok: { "12–14": 57, "15–19": 74, "20–29": 56, "30–39": 28, "40–49": 23, "50–59": 15, "60–69": 8, "70+": 3 },
  Facebook: { "12–14": 41, "15–19": 59, "20–29": 81, "30–39": 84, "40–49": 86, "50–59": 84, "60–69": 78, "70+": 72 },
  Instagram: { "12–14": 50, "15–19": 76, "20–29": 82, "30–39": 72, "40–49": 66, "50–59": 59, "60–69": 48, "70+": 32 },
  Meta: { "12–14": 64, "15–19": 82, "20–29": 90, "30–39": 89, "40–49": 91, "50–59": 88, "60–69": 83, "70+": 75 },
  Snap: { "12–14": 80, "15–19": 89, "20–29": 86, "30–39": 83, "40–49": 77, "50–59": 71, "60–69": 64, "70+": 42 },
};

const dailyAgePercent: Record<PlatformName, Record<AgeGroupName, number>> = {
  Schibsted: { "12–14": 25, "15–19": 26, "20–29": 44, "30–39": 55, "40–49": 60, "50–59": 60, "60–69": 55, "70+": 45 },
  Amedia: { "12–14": 5, "15–19": 7, "20–29": 24, "30–39": 38, "40–49": 44, "50–59": 48, "60–69": 46, "70+": 42 },
  Aller: { "12–14": 12, "15–19": 13, "20–29": 13, "30–39": 26, "40–49": 30, "50–59": 33, "60–69": 28, "70+": 24 },
  TikTok: { "12–14": 52, "15–19": 70, "20–29": 50, "30–39": 23, "40–49": 17, "50–59": 11, "60–69": 6, "70+": 2 },
  Facebook: { "12–14": 28, "15–19": 38, "20–29": 68, "30–39": 74, "40–49": 79, "50–59": 78, "60–69": 71, "70+": 66 },
  Instagram: { "12–14": 39, "15–19": 62, "20–29": 73, "30–39": 63, "40–49": 56, "50–59": 49, "60–69": 39, "70+": 25 },
  Meta: { "12–14": 51, "15–19": 71, "20–29": 85, "30–39": 83, "40–49": 86, "50–59": 83, "60–69": 77, "70+": 69 },
  Snap: { "12–14": 77, "15–19": 86, "20–29": 83, "30–39": 78, "40–49": 72, "50–59": 66, "60–69": 58, "70+": 37 },
};

function formatPercent(v: number) {
  return `${v.toFixed(1).replace(".", ",")}%`;
}

function kpiCard(title: string, value: string, subtitle: string) {
  return (
    <div style={{ background: "rgba(255,255,255,0.96)", color: "#0f172a", borderRadius: 20, padding: 24 }}>
      <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 40, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>{subtitle}</div>
    </div>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("market");
  const [selectedGeneration, setSelectedGeneration] = useState<GenerationName>("Gen Z");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformName>("Schibsted");
  const [periodMode, setPeriodMode] = useState<PeriodMode>("weekly");
  const [visiblePlatforms, setVisiblePlatforms] = useState<PlatformName[]>(["Schibsted"]);
  const [breakdownMode, setBreakdownMode] = useState<BreakdownMode>("generation");

  const togglePlatform = (platform: PlatformName) => {
    setVisiblePlatforms((current) => {
      if (current.includes(platform)) {
        if (current.length === 1) return current;
        return current.filter((p) => p !== platform);
      }
      return [...current, platform];
    });
  };

  const totalSource = periodMode === "weekly" ? weeklyPercent : dailyPercent;
  const generationSource = periodMode === "weekly" ? weeklyGenerationPercent : dailyGenerationPercent;
  const ageSource = periodMode === "weekly" ? weeklyAgePercent : dailyAgePercent;

  const marketData = useMemo(() => {
    return platformLabels
      .filter((platform) => visiblePlatforms.includes(platform))
      .map((platform) => ({ name: platform, value: totalSource[platform] }))
      .sort((a, b) => b.value - a.value);
  }, [visiblePlatforms, totalSource]);

  const lineData = useMemo<SeriesRow[]>(() => {
    const labels = breakdownMode === "generation" ? generationLabels : ageLabels;
    const source = breakdownMode === "generation" ? generationSource : ageSource;
    return labels.map((label) => {
      const row: SeriesRow = { label };
      visiblePlatforms.forEach((platform) => {
        row[platform] = source[platform][label as never] as number;
      });
      return row;
    });
  }, [visiblePlatforms, breakdownMode, generationSource, ageSource]);

  const generationComparisonData = useMemo(() => {
    return platformLabels
      .map((platform) => ({ name: platform, value: generationSource[platform][selectedGeneration] }))
      .sort((a, b) => b.value - a.value);
  }, [generationSource, selectedGeneration]);

  const platformProfileData = useMemo(() => {
    return generationLabels.map((generation) => ({ name: generation, value: generationSource[selectedPlatform][generation] }));
  }, [generationSource, selectedPlatform]);

  return (
    <div style={{ minHeight: "100vh", background: "#071B67", color: "white", fontFamily: "Inter, Arial, sans-serif", padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 12px", fontSize: 14, marginBottom: 16 }}>
            Audience Atlas
          </div>
          <h1 style={{ margin: 0, fontSize: 42 }}>Audience Atlas Prototype</h1>
          <p style={{ marginTop: 8, color: "rgba(255,255,255,0.8)" }}>Markedsoversikt, generasjoner og plattformprofil.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginBottom: 24 }}>
          {kpiCard("Befolkning", population.toLocaleString("nb-NO"), "Total Norge")}
          {kpiCard(`Schibsted ${periodMode === "weekly" ? "ukentlig" : "daglig"} dekning`, formatPercent(totalSource.Schibsted), "Live testversjon")}
          {kpiCard("Ledelse blant redaksjonelle", "+19,1 pp", "mot Amedia ukentlig")}
        </div>

        <div style={{ background: "rgba(255,255,255,0.96)", color: "#0f172a", borderRadius: 20, padding: 24, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0 }}>Visualisering</h2>
          <p style={{ color: "#64748b", marginTop: 0 }}>Velg visning, periode og relevante filtre.</p>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Velg visning</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => setViewMode("market")} style={{ borderRadius: 999, padding: "10px 14px", border: viewMode === "market" ? "1px solid #0f172a" : "1px solid #cbd5e1", background: viewMode === "market" ? "#0f172a" : "white", color: viewMode === "market" ? "white" : "#334155", cursor: "pointer" }}>Markedsutvikling</button>
              <button onClick={() => setViewMode("generation")} style={{ borderRadius: 999, padding: "10px 14px", border: viewMode === "generation" ? "1px solid #0f172a" : "1px solid #cbd5e1", background: viewMode === "generation" ? "#0f172a" : "white", color: viewMode === "generation" ? "white" : "#334155", cursor: "pointer" }}>Generasjon</button>
              <button onClick={() => setViewMode("profile")} style={{ borderRadius: 999, padding: "10px 14px", border: viewMode === "profile" ? "1px solid #0f172a" : "1px solid #cbd5e1", background: viewMode === "profile" ? "#0f172a" : "white", color: viewMode === "profile" ? "white" : "#334155", cursor: "pointer" }}>Plattformprofil</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Periode</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setPeriodMode("daily")} style={{ borderRadius: 999, padding: "10px 14px", border: periodMode === "daily" ? "1px solid #0f172a" : "1px solid #cbd5e1", background: periodMode === "daily" ? "#0f172a" : "white", color: periodMode === "daily" ? "white" : "#334155", cursor: "pointer" }}>Dag</button>
                <button onClick={() => setPeriodMode("weekly")} style={{ borderRadius: 999, padding: "10px 14px", border: periodMode === "weekly" ? "1px solid #0f172a" : "1px solid #cbd5e1", background: periodMode === "weekly" ? "#0f172a" : "white", color: periodMode === "weekly" ? "white" : "#334155", cursor: "pointer" }}>Uke</button>
              </div>
            </div>

            {viewMode === "market" && (
              <>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Bryt ned på</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setBreakdownMode("generation")} style={{ borderRadius: 999, padding: "10px 14px", border: breakdownMode === "generation" ? "1px solid #0f172a" : "1px solid #cbd5e1", background: breakdownMode === "generation" ? "#0f172a" : "white", color: breakdownMode === "generation" ? "white" : "#334155", cursor: "pointer" }}>Generasjon</button>
                    <button onClick={() => setBreakdownMode("age")} style={{ borderRadius: 999, padding: "10px 14px", border: breakdownMode === "age" ? "1px solid #0f172a" : "1px solid #cbd5e1", background: breakdownMode === "age" ? "#0f172a" : "white", color: breakdownMode === "age" ? "white" : "#334155", cursor: "pointer" }}>Alder</button>
                  </div>
                </div>
                <div style={{ minWidth: 280, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Velg kanaler</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {platformLabels.map((platform) => {
                      const active = visiblePlatforms.includes(platform);
                      return (
                        <button key={platform} onClick={() => togglePlatform(platform)} style={{ borderRadius: 999, padding: "10px 14px", border: active ? "1px solid #0f172a" : "1px solid #cbd5e1", background: active ? "#0f172a" : "white", color: active ? "white" : "#334155", cursor: "pointer" }}>{platform}</button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {viewMode === "generation" && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Velg generasjon</div>
                <select value={selectedGeneration} onChange={(e) => setSelectedGeneration(e.target.value as GenerationName)} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5e1", minWidth: 180 }}>
                  {generationLabels.map((generation) => <option key={generation} value={generation}>{generation}</option>)}
                </select>
              </div>
            )}

            {viewMode === "profile" && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Velg plattform</div>
                <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value as PlatformName)} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5e1", minWidth: 180 }}>
                  {platformLabels.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {viewMode === "market" && (
          <>
            <div style={{ background: "#0B237A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>Markedsutvikling</h2>
              <p style={{ marginTop: 0, color: "rgba(255,255,255,0.8)" }}>Se hvordan plattformene utvikler seg på tvers av {breakdownMode === "generation" ? "generasjoner" : "aldersgrupper"}.</p>
              <div style={{ width: "100%", height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fill: "white" }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "white" }} tickFormatter={(v) => `${Math.round(Number(v))}%`} />
                    <Tooltip formatter={(v: number) => formatPercent(v)} />
                    <Legend />
                    {visiblePlatforms.map((platform) => (
                      <Line key={platform} type="monotone" dataKey={platform} stroke={colors[platform]} strokeWidth={platform === "Schibsted" ? 5 : 3} strokeDasharray={platform === "Meta" ? "6 6" : "0"} dot={{ r: 4 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24 }}>
              <div style={{ background: "#0B237A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24 }}>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>Markedsoversikt total</h2>
                <p style={{ marginTop: 0, color: "rgba(255,255,255,0.8)" }}>{periodMode === "weekly" ? "Ukentlig" : "Daglig"} total dekning per plattform.</p>
                <div style={{ width: "100%", height: 420 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: "white" }} tickFormatter={(v) => `${Math.round(Number(v))}%`} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "white" }} width={100} />
                      <Tooltip formatter={(v: number) => formatPercent(v)} />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                        {marketData.map((entry) => <Cell key={entry.name} fill={colors[entry.name as PlatformName]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ background: "#0B237A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24 }}>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>Markedsoversikt fordelt</h2>
                <p style={{ marginTop: 0, color: "rgba(255,255,255,0.8)" }}>Fordelt på {breakdownMode === "generation" ? "generasjoner" : "aldersgrupper"}.</p>
                <div style={{ width: "100%", height: 420 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fill: "white" }} />
                      <YAxis domain={[0, 100]} tick={{ fill: "white" }} tickFormatter={(v) => `${Math.round(Number(v))}%`} />
                      <Tooltip formatter={(v: number) => formatPercent(v)} />
                      <Legend />
                      {visiblePlatforms.map((platform) => <Bar key={platform} dataKey={platform} fill={colors[platform]} radius={[6, 6, 0, 0]} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {viewMode === "generation" && (
          <div style={{ background: "#0B237A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24, marginBottom: 24 }}>
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>Generasjon</h2>
            <p style={{ marginTop: 0, color: "rgba(255,255,255,0.8)" }}>Se alle kanalenes dekning innenfor valgt generasjon.</p>
            <div style={{ width: "100%", height: 480 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generationComparisonData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "white" }} tickFormatter={(v) => `${Math.round(Number(v))}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "white" }} width={100} />
                  <Tooltip formatter={(v: number) => formatPercent(v)} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                    {generationComparisonData.map((entry) => <Cell key={entry.name} fill={colors[entry.name as PlatformName]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {viewMode === "profile" && (
          <div style={{ background: "#0B237A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24, marginBottom: 24 }}>
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>Plattformprofil</h2>
            <p style={{ marginTop: 0, color: "rgba(255,255,255,0.8)" }}>Generasjoners dekning innenfor valgt plattform.</p>
            <div style={{ width: "100%", height: 480 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformProfileData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: "white" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "white" }} tickFormatter={(v) => `${Math.round(Number(v))}%`} />
                  <Tooltip formatter={(v: number) => formatPercent(v)} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} fill={colors[selectedPlatform]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const EXAMPLES = [
  "I was in my childhood home but it was also underwater and I could breathe",
  "My dog was the size of a building and we were walking through a city made of clouds",
  "I was late for a test at a school I've never been to and the hallways kept stretching longer",
  "I could fly but only a few feet off the ground and everyone acted like it was normal",
  "I was having dinner with someone I haven't seen in years in a restaurant that kept changing",
];

export default function Home() {
  const [dream, setDream] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!dream.trim()) return;
    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream }),
      });

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();
      setVideoUrl(`data:video/mp4;base64,${data.video}`);
    } catch {
      setError("Dream rendering failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Dream Machine</h1>
        <p style={{ color: "#888", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Describe a dream. Watch it come to life.
        </p>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="I was flying over a city made of glass and the streets were rivers..."
          rows={3}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
            color: "#fafafa",
            resize: "vertical",
            fontFamily: "monospace",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={generate}
          disabled={loading || !dream.trim()}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            background: loading ? "#333" : "#fff",
            color: loading ? "#888" : "#0a0a0a",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Dreaming... (this takes a minute or two)" : "Fall Asleep"}
        </button>

      </div>

      {error && (
        <p style={{ color: "#ff4444", fontSize: "0.9rem" }}>{error}</p>
      )}

      {videoUrl && (
        <div
          style={{
            width: "100%",
            maxWidth: "720px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #333",
          }}
        >
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            style={{ width: "100%", display: "block" }}
          />
        </div>
      )}
    </main>
  );
}

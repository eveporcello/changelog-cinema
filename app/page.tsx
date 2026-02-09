"use client";

import { useState } from "react";

const EXAMPLES = [
  "fixed a race condition in the auth middleware",
  "removed deprecated endpoint, migrated 2 million users to v2",
  "bumped left-pad from 1.1.1 to 1.1.2",
  "killed zombie processes that were eating all the memory",
  "resolved merge conflict between frontend and backend teams",
];

export default function Home() {
  const [changelog, setChangelog] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!changelog.trim()) return;
    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changelog }),
      });

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();
      setVideoUrl(`data:video/mp4;base64,${data.video}`);
    } catch {
      setError("Video generation failed. Check your API key and try again.");
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
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Changelog Cinema</h1>
        <p style={{ color: "#888", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Paste a changelog entry. Get a cinematic trailer.
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
          value={changelog}
          onChange={(e) => setChangelog(e.target.value)}
          placeholder="fixed a race condition in the auth middleware..."
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
          disabled={loading || !changelog.trim()}
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
          {loading ? "Generating... (this takes a minute or two)" : "Action!"}
        </button>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {EXAMPLES.map((example) => (
            <button
              key={example}
              onClick={() => setChangelog(example)}
              style={{
                padding: "0.4rem 0.75rem",
                fontSize: "0.8rem",
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "20px",
                color: "#888",
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              {example}
            </button>
          ))}
        </div>
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

import { useState } from "react";
import { Link } from "react-router-dom";

const KEY = "fb_manuals_v1";

function loadManuals() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function saveManuals(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export default function Manuals() {
  const [manuals, setManuals] = useState(() => loadManuals());
  const [status, setStatus] = useState("");

  async function onPick(e) {
    const files = e.target.files;
    if (!files?.length) return;

    const added = [];
    for (const f of Array.from(files)) {
      added.push({ id: crypto.randomUUID(), name: f.name, size: f.size, createdAt: Date.now() });
    }

    const next = [...added, ...manuals];
    setManuals(next);
    saveManuals(next);
    setStatus(`✅ Added ${added.length} manual(s) (demo stores file info; text extraction next).`);
    e.target.value = "";
  }

  function clearAll() {
    localStorage.removeItem(KEY);
    setManuals([]);
    setStatus("Cleared manuals.");
  }

  return (
    <div style={{ minHeight: "100vh", padding: 20, display: "grid", placeItems: "center" }}>
      <div className="card" style={{ width: "min(900px, 96vw)", padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Manuals</h2>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <Link to="/chat" className="btn" style={{ background: "#1f2a44" }}>← Back</Link>
            <button onClick={clearAll} className="btn" style={{ background: "#3a1f2a" }}>Clear</button>
          </div>
        </div>

        <p className="small" style={{ marginTop: 8 }}>
          Upload PDFs for the demo. We’ll connect text extraction + retrieval next.
        </p>

        <input type="file" accept="application/pdf" multiple onChange={onPick} />

        {status && <div className="small" style={{ marginTop: 10 }}>{status}</div>}

        <div style={{ marginTop: 16 }}>
          <div className="small" style={{ fontWeight: 700 }}>Uploaded ({manuals.length})</div>
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {manuals.map((m) => (
              <div key={m.id} className="card" style={{ padding: 10, background: "#0f1627" }}>
                <div style={{ fontWeight: 700 }}>{m.name}</div>
                <div className="small">{Math.round(m.size / 1024)} KB • {new Date(m.createdAt).toLocaleString()}</div>
              </div>
            ))}
            {manuals.length === 0 && <div className="small">No manuals uploaded yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

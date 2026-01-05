import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  const saved = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("fb_user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [name, setName] = useState(saved?.name || "");
  const [role, setRole] = useState(saved?.role || "Mechanic");

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem("fb_user", JSON.stringify({ name: name.trim(), role }));
    nav("/chat");
  }

  return (
    <div className="fb-bg">
      <div className="card" style={{ width: "min(560px, 95vw)", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h1 style={{ margin: 0, letterSpacing: 0.3 }}>FutureBots</h1>
          <span className="small">Mechanic Assistant</span>
        </div>

        <p className="small" style={{ marginTop: 10, lineHeight: 1.4 }}>
          Login to ask questions and upload manuals. (Demo: saved locally)
        </p>

        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 14 }}>
          <div>
            <div className="small" style={{ marginBottom: 6 }}>Name</div>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Jaya Sankar"
              autoFocus
            />
          </div>

          <div>
            <div className="small" style={{ marginBottom: 6 }}>Role</div>
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Mechanic</option>
              <option>Supervisor</option>
              <option>Engineer</option>
            </select>
          </div>

          <button className="btn" type="submit" disabled={!name.trim()}>
            Continue →
          </button>

          <div className="small">Tip: enter any name for the demo.</div>
        </form>
      </div>
    </div>
  );
}

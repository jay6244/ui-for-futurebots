import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ACTIVE_KEY = "fb_active_conv_v1";
const CONV_KEY = "fb_conversations_v1";

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem("fb_user") || "null");
  } catch {
    return null;
  }
}

function loadConversations() {
  try {
    return JSON.parse(localStorage.getItem(CONV_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveConversations(list) {
  localStorage.setItem(CONV_KEY, JSON.stringify(list));
}

function loadActiveId() {
  return localStorage.getItem(ACTIVE_KEY) || "";
}

function saveActiveId(id) {
  localStorage.setItem(ACTIVE_KEY, id);
}

function newId() {
  return crypto?.randomUUID?.() || String(Date.now());
}

export default function Chat() {
  const nav = useNavigate();
  const user = useMemo(() => loadUser(), []);
  const bottomRef = useRef(null);

  const [convs, setConvs] = useState(() => loadConversations());
  const [activeId, setActiveId] = useState(() => loadActiveId());
  const [text, setText] = useState("");

  const active = useMemo(
    () => convs.find((c) => c.id === activeId) || null,
    [convs, activeId]
  );

  const messages = active?.messages || [];

  useEffect(() => saveConversations(convs), [convs]);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages.length]);

  function logout() {
    localStorage.removeItem("fb_user");
    nav("/login");
  }

  function startNewChat() {
    const id = newId();
    const now = Date.now();
    const c = { id, title: "New chat", updatedAt: now, messages: [] };
    const next = [c, ...convs];
    setConvs(next);
    setActiveId(id);
    saveActiveId(id);
  }

  function openConv(id) {
    setActiveId(id);
    saveActiveId(id);
  }

  function send(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;

    let list = convs;
    let id = activeId;

    if (!id) {
      id = newId();
      list = [{ id, title: "New chat", updatedAt: Date.now(), messages: [] }, ...convs];
    }

    const idx = list.findIndex((c) => c.id === id);
    const conv = idx >= 0 ? list[idx] : list[0];

    const userMsg = { role: "user", content: t, ts: Date.now() };
    const botMsg = {
      role: "assistant",
      content:
        "✅ Demo response: I can answer based on uploaded manuals.\n\nNext step: connect PDF extraction + retrieval.",
      ts: Date.now() + 1,
    };

    const title =
      conv.title === "New chat"
        ? (t.length > 28 ? t.slice(0, 28) + "…" : t)
        : conv.title;

    const updated = {
      ...conv,
      title,
      messages: [...(conv.messages || []), userMsg, botMsg],
      updatedAt: Date.now(),
    };

    const next = [...list];
    next[idx >= 0 ? idx : 0] = updated;
    next.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    setConvs(next);
    setActiveId(id);
    saveActiveId(id);
    setText("");
  }

  return (
    <div className="cg-layout">
      <aside className="cg-sidebar">
        <button className="cg-newchat" onClick={startNewChat}>
          + New chat
        </button>

        <Link to="/manuals" className="cg-linkbtn">
          Manuals
        </Link>

        <div className="cg-list">
          {convs.length === 0 ? (
            <div className="small">No chats yet.</div>
          ) : (
            convs.map((c) => (
              <div
                key={c.id}
                className={`cg-item ${c.id === activeId ? "active" : ""}`}
                onClick={() => openConv(c.id)}
                title={c.title}
              >
                <div
                  className="small"
                  style={{
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.title}
                </div>
              </div>
            ))
          )}
        </div>

        <button
          className="cg-linkbtn"
          onClick={logout}
          style={{ background: "rgba(58,31,42,0.55)" }}
        >
          Logout
        </button>
      </aside>

      <section className="cg-main">
        <header className="cg-topbar">
          <div className="cg-brand">FutureBots</div>
          <div className="cg-user">
            {user?.name ? `${user.name} • ${user.role || "Mechanic"}` : "User"}
          </div>
        </header>

        <div className="cg-scroll">
          {messages.length === 0 ? (
            <div className="cg-empty">
              <h1>Ready when you are.</h1>
              <p className="small">
                Ask about machine errors, symptoms, and repair steps.
              </p>
            </div>
          ) : (
            <div className="cg-chat">
              {messages.map((m, i) => (
                <div key={i} className="cg-msg">
                  <div className={`cg-row ${m.role}`}>
                    <div style={{ width: "100%" }}>
                      <div className="cg-role">
                        {m.role === "user" ? "You" : "FutureBots"}
                      </div>
                      <div className={`cg-bubble ${m.role}`}>{m.content}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <form onSubmit={send} className="cg-inputbar">
          <div className="cg-inputwrap">
            <button type="button" className="cg-iconbtn" title="Attach (demo UI)">
              +
            </button>

            <input
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask anything"
            />

            <button type="button" className="cg-iconbtn" title="Voice (demo UI)">
              🎤
            </button>

            <button className="btn" disabled={!text.trim()}>
              Send
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}


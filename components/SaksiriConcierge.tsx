"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Which room is best for a couple?",
  "What amenities are at the hotel?",
  "Plan a 3-day Vang Vieng stay",
  "How can I book?",
];

function ConciergeIcon({ small = false }: { small?: boolean }) {
  return (
    <svg width={small ? 18 : 22} height={small ? 18 : 22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.7 17.2 5 21l4.1-2.1c1.1.4 2.3.6 3.6.6 5 0 9-3.4 9-7.6s-4-7.6-9-7.6-9 3.4-9 7.6c0 1.6.5 3.1 1.4 4.3Z" stroke="currentColor" strokeWidth="1.45"/>
      <path d="M8.7 11.9h.1M12 11.9h.1M15.3 11.9h.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

export default function SaksiriConcierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to Saksiri. I’m your virtual concierge. Tell me what you’re planning — a room, a few days in Vang Vieng, hotel amenities, or booking guidance.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text = input) {
    const value = text.trim();
    if (!value || busy) return;

    setInput("");
    const next = [...messages, { role: "user" as const, content: value }];
    setMessages(next);
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply || "Tell me what you would like to know about Saksiri." },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "I’m having trouble connecting right now. Please use Book Now or WhatsApp and the hotel team can help you directly." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className={`concierge-trigger ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Saksiri concierge" : "Open Saksiri AI concierge"}
      >
        <span className="concierge-trigger__icon"><ConciergeIcon /></span>
        <span className="concierge-trigger__label">{open ? "CLOSE" : "ASK SAKSIRI"}</span>
        {!open && <span className="concierge-trigger__live" />}
        <span className="concierge-trigger__arrow">{open ? "×" : "↗"}</span>
      </button>

      <aside className={`concierge-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="concierge-panel__top">
          <div className="concierge-heading">
            <div className="concierge-avatar"><ConciergeIcon small /></div>
            <div>
              <span className="concierge-panel__eyebrow">SAKSIRI · VANG VIENG</span>
              <h2>Saksiri Concierge</h2>
              <p><span className="status-dot" />AI travel & hotel guide</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close concierge">×</button>
        </div>

        <div className="concierge-panel__messages">
          {messages.map((message, index) => (
            <div key={index} className={`concierge-message concierge-message--${message.role}`}>
              <span className="message-role">{message.role === "assistant" ? "SAKSIRI CONCIERGE" : "YOU"}</span>
              {message.content}
            </div>
          ))}

          {messages.length === 1 && (
            <div className="concierge-suggestions">
              {suggestions.map((item) => (
                <button key={item} onClick={() => send(item)}>
                  {item}<span>↗</span>
                </button>
              ))}
            </div>
          )}

          {busy && (
            <div className="concierge-message concierge-message--assistant concierge-typing">
              <i /><i /><i />
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="concierge-panel__bottom">
          <form onSubmit={(event) => { event.preventDefault(); send(); }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about rooms, Vang Vieng, amenities..."
              aria-label="Message the Saksiri concierge"
            />
            <button disabled={busy || !input.trim()} aria-label="Send message">↑</button>
          </form>
          <div className="concierge-panel__links">
            <a href="#booking">BOOK YOUR STAY</a>
            <a href="https://wa.me/8562022430999" target="_blank" rel="noreferrer">WHATSAPP</a>
          </div>
        </div>
      </aside>
    </>
  );
}

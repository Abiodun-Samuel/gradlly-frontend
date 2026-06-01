"use client";
import { Send } from "lucide-react";
import { useState } from "react";

import { T } from "./tokens";

const SEED = [
  {
    from: "tutor",
    sender: "Marcus Reid",
    text: "Jamie is making great progress on the architecture module.",
    ts: "28 Mar 2025 · 09:14",
  },
  {
    from: "me",
    sender: "Sarah Rahman",
    text: "Thanks Marcus — will ensure he gets the work project allocation sorted.",
    ts: "28 Mar 2025 · 10:02",
  },
];

export function ProfileMessages() {
  const [messages, setMessages] = useState(SEED);
  const [to, setTo] = useState("Tutor");
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { from: "me", sender: "Sarah Rahman", text: text.trim(), ts: "Now" },
    ]);
    setText("");
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold" style={{ color: T.subtle }}>
          Message to:
        </span>
        {["Tutor", "Apprentice"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTo(t)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: to === t ? T.blue : T.card,
              color: to === t ? "#fff" : T.subtle,
              border: `1px solid ${to === t ? T.blue : T.border}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 max-h-72 overflow-y-auto py-1">
        {messages.length === 0 && (
          <p className="text-xs text-center py-6" style={{ color: T.muted }}>
            No messages yet — start a conversation
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.from === "me" ? "items-end" : "items-start"}`}
          >
            <div
              className="max-w-[80%] rounded-2xl px-3.5 py-2.5"
              style={{
                backgroundColor: m.from === "me" ? T.blue : T.card,
                color: m.from === "me" ? "#fff" : T.ink,
              }}
            >
              <p className="text-xs">{m.text}</p>
            </div>
            <p className="text-[10px] mt-0.5 px-1" style={{ color: T.muted }}>
              {m.sender} · {m.ts}
            </p>
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-2 pt-2"
        style={{ borderTop: `1px solid ${T.border}` }}
      >
        <input
          type="text"
          placeholder={`Message ${to}…`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none"
          style={{
            backgroundColor: T.card,
            borderColor: T.border,
            color: T.ink,
          }}
        />
        <button
          type="button"
          onClick={send}
          className="flex h-8 w-8 items-center justify-center rounded-xl hover:opacity-80 transition-opacity"
          style={{ backgroundColor: T.blue, color: "#fff" }}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

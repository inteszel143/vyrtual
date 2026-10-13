"use client";

import { useState, type FormEvent } from "react";

type Message = { id: number; text: string; fromMe: boolean; time: string };
type Conversation = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: "morgan",
    name: "Morgan Park",
    role: "Project lead",
    initials: "MP",
    color: "bg-emerald-300/15 text-emerald-200",
    lastMessage: "Sounds good, thanks!",
    time: "10:42 AM",
    unread: true,
    messages: [
      { id: 1, text: "Hey Alex, could you take a look at the latest studio concepts?", fromMe: false, time: "10:35 AM" },
      { id: 2, text: "Absolutely. I’ll review them this morning.", fromMe: true, time: "10:38 AM" },
      { id: 3, text: "Sounds good, thanks!", fromMe: false, time: "10:42 AM" },
    ],
  },
  {
    id: "avery",
    name: "Avery Chen",
    role: "Product designer",
    initials: "AC",
    color: "bg-violet-300/15 text-violet-200",
    lastMessage: "I added notes to the board.",
    time: "Yesterday",
    messages: [
      { id: 1, text: "I added notes to the board.", fromMe: false, time: "Yesterday" },
      { id: 2, text: "Thanks, I’ll check those out.", fromMe: true, time: "Yesterday" },
    ],
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    role: "Frontend developer",
    initials: "JL",
    color: "bg-sky-300/15 text-sky-200",
    lastMessage: "Are we still on for the handoff?",
    time: "Yesterday",
    messages: [
      { id: 1, text: "Are we still on for the handoff?", fromMe: false, time: "Yesterday" },
    ],
  },
];

export default function MessageCenter() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const activeConversation = conversations.find(({ id }) => id === activeId);
  const visibleConversations = conversations.filter(({ name }) =>
    name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !activeConversation) return;

    const time = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              lastMessage: text,
              time,
              messages: [
                ...conversation.messages,
                { id: Date.now(), text, fromMe: true, time },
              ],
            }
          : conversation,
      ),
    );
    setDraft("");
  };

  return (
    <section className="grid min-h-[620px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111116] md:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-white/[0.07] md:border-b-0 md:border-r">
        <div className="border-b border-white/[0.06] p-4">
          <label htmlFor="message-search" className="sr-only">Search conversations</label>
          <input
            id="message-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0d0d12] px-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-sky-300/40"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-2 md:max-h-[540px]">
          {visibleConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => setActiveId(conversation.id)}
              aria-current={conversation.id === activeId ? "true" : undefined}
              className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors ${
                conversation.id === activeId
                  ? "bg-sky-300/[0.08]"
                  : "hover:bg-white/[0.04]"
              }`}
            >
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${conversation.color}`}>
                {conversation.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-medium text-zinc-100">{conversation.name}</span>
                  <span className="shrink-0 text-[9px] text-zinc-600">{conversation.time}</span>
                </span>
                <span className="mt-1 block truncate text-[10px] text-zinc-500">{conversation.lastMessage}</span>
              </span>
              {conversation.unread && <span aria-label="Unread" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-300" />}
            </button>
          ))}
          {visibleConversations.length === 0 && (
            <p className="px-3 py-8 text-center text-xs text-zinc-500">No conversations found.</p>
          )}
        </div>
      </aside>

      {activeConversation ? (
        <div className="flex min-h-[420px] min-w-0 flex-col">
          <header className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
            <span className={`flex size-9 items-center justify-center rounded-full text-[10px] font-semibold ${activeConversation.color}`}>
              {activeConversation.initials}
            </span>
            <span>
              <span className="block text-xs font-medium text-white">{activeConversation.name}</span>
              <span className="mt-1 block text-[10px] text-zinc-500">{activeConversation.role}</span>
            </span>
          </header>
          <div aria-live="polite" className="flex-1 space-y-4 overflow-y-auto p-5">
            {activeConversation.messages.map((message) => (
              <div key={message.id} className={`flex ${message.fromMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.fromMe
                    ? "rounded-br-md bg-sky-300 text-slate-950"
                    : "rounded-bl-md bg-white/[0.06] text-zinc-200"
                }`}>
                  <p className="text-xs leading-5">{message.text}</p>
                  <p className={`mt-1 text-right text-[9px] ${message.fromMe ? "text-slate-700" : "text-zinc-500"}`}>{message.time}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="border-t border-white/[0.06] p-4">
            <label htmlFor="message-draft" className="sr-only">Write a message</label>
            <div className="flex items-center gap-2">
              <input
                id="message-draft"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Message ${activeConversation.name}`}
                className="h-11 min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-[#0d0d12] px-4 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-sky-300/40"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="h-11 rounded-xl bg-sky-300 px-4 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex min-h-[420px] items-center justify-center p-6 text-center text-xs text-zinc-500">
          Choose a conversation to view messages.
        </div>
      )}
      <p className="col-span-full border-t border-white/[0.06] px-4 py-2 text-center text-[10px] text-zinc-600">
        Messaging preview · Messages are local to this page and are not delivered or saved.
      </p>
    </section>
  );
}

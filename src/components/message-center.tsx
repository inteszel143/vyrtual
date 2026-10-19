"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  getMessagePreviewServerSnapshot,
  getMessagePreviewSnapshot,
  initialConversations,
  subscribeToMessagePreview,
  updateMessagePreview,
  type PreviewConversation,
} from "@/lib/message-preview";

type CreationMode = "message" | "group" | "channel";

export default function MessageCenter({ allowCreation = false }: { allowCreation?: boolean }) {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("to");
  const conversationSnapshot = useSyncExternalStore(
    subscribeToMessagePreview,
    getMessagePreviewSnapshot,
    getMessagePreviewServerSnapshot,
  );
  const conversations = JSON.parse(conversationSnapshot) as PreviewConversation[];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeId =
    selectedId ??
    conversations.find(({ id }) => id === requestedId)?.id ??
    conversations[0]?.id;
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [creationMode, setCreationMode] = useState<CreationMode | null>(null);
  const [recipientId, setRecipientId] = useState(initialConversations[0].id);
  const [newMessage, setNewMessage] = useState("");
  const [conversationName, setConversationName] = useState("");
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [useForCheckIns, setUseForCheckIns] = useState(true);
  const activeConversation = conversations.find(({ id }) => id === activeId);
  const people = conversations.filter(({ kind }) => !kind);
  const visibleConversations = conversations.filter(({ name }) =>
    name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const closeCreation = () => {
    setCreationMode(null);
    setNewMessage("");
    setConversationName("");
    setParticipantIds([]);
    setUseForCheckIns(true);
    setUseForCheckIns(true);
  };

  const createConversation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!creationMode) return;

    if (creationMode === "message") {
      const recipient = people.find(({ id }) => id === recipientId);
      const text = newMessage.trim();
      if (!recipient || !text) return;

      const time = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date());
      const message = { id: new Date().getTime(), text, fromMe: true, time };

      updateMessagePreview((current) =>
        current.map((conversation) =>
          conversation.id === recipient.id
            ? { ...conversation, lastMessage: text, time, messages: [...conversation.messages, message] }
            : conversation,
        ),
      );
      setSelectedId(recipient.id);
      setDraft("");
      closeCreation();
      return;
    }

    const name = conversationName.trim();
    const participants = people.filter(({ id }) => participantIds.includes(id));
    if (!name || participants.length === 0) return;

    const conversation: PreviewConversation = {
      id: `${creationMode}-${new Date().getTime()}`,
      name,
      role: `${creationMode === "channel" ? "Channel" : "Group"} · ${participants.length} ${participants.length === 1 ? "member" : "members"}`,
      kind: creationMode,
      isCheckInChannel: creationMode === "channel" && useForCheckIns,
      participantIds: participants.map(({ id }) => id),
      initials: name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase(),
      color: creationMode === "channel" ? "bg-sky-300/15 text-sky-200" : "bg-violet-300/15 text-violet-200",
      lastMessage: "Start a conversation",
      time: "",
      messages: [],
    };

    updateMessagePreview((current) => [
      ...current.map((item) =>
        creationMode === "channel" && useForCheckIns
          ? { ...item, isCheckInChannel: false }
          : item,
      ),
      conversation,
    ]);
    setSelectedId(conversation.id);
    setDraft("");
    closeCreation();
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !activeConversation) return;

    const time = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());

    updateMessagePreview((current) =>
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
    <>
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
          {allowCreation && (
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {([
                ["message", "Message"],
                ["group", "Group"],
                ["channel", "Channel"],
              ] as const).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setCreationMode(mode);
                    setRecipientId(people[0]?.id ?? "");
                    setNewMessage("");
                    setConversationName("");
                    setParticipantIds([]);
                    setUseForCheckIns(true);
                  }}
                  aria-label={`Create ${mode === "message" ? "a new message" : `a new ${mode}`}`}
                  className="rounded-lg border border-white/[0.08] px-1 py-2 text-[10px] font-medium text-zinc-300 transition-colors hover:border-sky-300/30 hover:bg-sky-300/[0.06] hover:text-white"
                >
                  <span aria-hidden="true" className="mr-1 text-sky-300">+</span>{label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto p-2 md:max-h-[540px]">
          {visibleConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => setSelectedId(conversation.id)}
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
                  <span className="truncate text-xs font-medium text-zinc-100">
                    {conversation.kind === "channel" ? "#" : ""}{conversation.name}
                  </span>
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
              <span className="block text-xs font-medium text-white">
                {activeConversation.kind === "channel" ? "#" : ""}{activeConversation.name}
              </span>
              <span className="mt-1 block text-[10px] text-zinc-500">
                {activeConversation.role}
                {activeConversation.kind === "channel" && activeConversation.isCheckInChannel ? " · Time-in check-ins" : ""}
              </span>
            </span>
            {allowCreation && activeConversation.kind === "channel" && (
              <button
                type="button"
                aria-pressed={Boolean(activeConversation.isCheckInChannel)}
                onClick={() => {
                  const selectedChannelId = activeConversation.isCheckInChannel
                    ? null
                    : activeConversation.id;
                  updateMessagePreview((current) =>
                    current.map((conversation) => ({
                      ...conversation,
                      isCheckInChannel: conversation.kind === "channel"
                        && conversation.id === selectedChannelId,
                    })),
                  );
                }}
                className="ml-auto rounded-lg border border-white/[0.08] px-2.5 py-2 text-[10px] font-medium text-zinc-300 transition-colors hover:border-sky-300/30 hover:text-white"
              >
                {activeConversation.isCheckInChannel ? "Disable check-ins" : "Use for time-in check-ins"}
              </button>
            )}
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
                placeholder={`Message ${activeConversation.kind === "channel" ? "#" : ""}${activeConversation.name}`}
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
        Messaging preview · Saved in this browser only; messages are not delivered to other users.
      </p>
    </section>
    {allowCreation && creationMode && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="message-create-title"
          className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#111116] p-5 shadow-2xl"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 id="message-create-title" className="text-lg font-semibold text-white">
                {creationMode === "message" ? "New message" : `Create ${creationMode}`}
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                {creationMode === "message"
                  ? "Choose a teammate and write a message."
                  : `Create a ${creationMode} conversation for your team.`}
              </p>
            </div>
            <button
              type="button"
              onClick={closeCreation}
              aria-label="Close"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-white"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <form onSubmit={createConversation} className="space-y-4">
            {creationMode === "message" ? (
              <>
                <div>
                  <label htmlFor="message-recipient" className="mb-2 block text-xs font-medium text-zinc-300">To</label>
                  <select
                    id="message-recipient"
                    value={recipientId}
                    onChange={(event) => setRecipientId(event.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0d12] px-3 text-xs text-white outline-none focus:border-sky-300/40"
                  >
                    {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="new-message-text" className="mb-2 block text-xs font-medium text-zinc-300">Message</label>
                  <textarea
                    id="new-message-text"
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    required
                    rows={4}
                    placeholder="Write your message..."
                    className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#0d0d12] px-3 py-2.5 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-sky-300/40"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="conversation-name" className="mb-2 block text-xs font-medium text-zinc-300">
                    {creationMode === "channel" ? "Channel name" : "Group name"}
                  </label>
                  <input
                    id="conversation-name"
                    value={conversationName}
                    onChange={(event) => setConversationName(event.target.value)}
                    required
                    maxLength={60}
                    placeholder={creationMode === "channel" ? "e.g. product-updates" : "e.g. Design team"}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0d12] px-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-sky-300/40"
                  />
                </div>
                <fieldset>
                  <legend className="mb-2 text-xs font-medium text-zinc-300">Add teammates</legend>
                  <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0d0d12] p-2">
                    {people.map((person) => (
                      <label key={person.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-xs text-zinc-300 hover:bg-white/[0.04]">
                        <input
                          type="checkbox"
                          checked={participantIds.includes(person.id)}
                          onChange={(event) => setParticipantIds((current) =>
                            event.target.checked
                              ? [...current, person.id]
                              : current.filter((id) => id !== person.id),
                          )}
                          className="size-4 accent-sky-300"
                        />
                        <span>{person.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {creationMode === "channel" && (
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-[#0d0d12] p-3 text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={useForCheckIns}
                      onChange={(event) => setUseForCheckIns(event.target.checked)}
                      className="mt-0.5 size-4 accent-sky-300"
                    />
                    <span>
                      <span className="block font-medium text-white">Use for time-in check-ins</span>
                      <span className="mt-1 block text-[10px] leading-4 text-zinc-500">Post “Good morning - Check in” here when a teammate times in.</span>
                    </span>
                  </label>
                )}
              </>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeCreation}
                className="h-10 rounded-xl border border-white/[0.08] px-4 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creationMode === "message"
                  ? !newMessage.trim() || !recipientId
                  : !conversationName.trim() || participantIds.length === 0}
                className="h-10 rounded-xl bg-sky-300 px-4 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {creationMode === "message" ? "Send message" : `Create ${creationMode}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}

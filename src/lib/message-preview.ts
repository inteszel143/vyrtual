export type PreviewMessage = {
  id: number;
  text: string;
  fromMe: boolean;
  time: string;
};

export type PreviewConversation = {
  id: string;
  name: string;
  role: string;
  kind?: "group" | "channel";
  isCheckInChannel?: boolean;
  participantIds?: string[];
  initials: string;
  color: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  messages: PreviewMessage[];
};

const STORAGE_KEY = "vyrtual-message-preview-conversations";
const CHANGE_EVENT = "vyrtual-message-preview-change";

export const initialConversations: PreviewConversation[] = [
  {
    id: "morgan-park",
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
    id: "avery-chen",
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
    id: "jordan-lee",
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
  {
    id: "sam-rivera",
    name: "Sam Rivera",
    role: "Content writer",
    initials: "SR",
    color: "bg-rose-300/15 text-rose-200",
    lastMessage: "Start a conversation",
    time: "",
    messages: [],
  },
  {
    id: "taylor-brooks",
    name: "Taylor Brooks",
    role: "Software engineer",
    initials: "TB",
    color: "bg-amber-300/15 text-amber-200",
    lastMessage: "Start a conversation",
    time: "",
    messages: [],
  },
  {
    id: "casey-kim",
    name: "Casey Kim",
    role: "Data analyst",
    initials: "CK",
    color: "bg-indigo-300/15 text-indigo-200",
    lastMessage: "Start a conversation",
    time: "",
    messages: [],
  },
];

const initialSnapshot = JSON.stringify(initialConversations);

export function subscribeToMessagePreview(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function getMessagePreviewSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? initialSnapshot;
}

export function getMessagePreviewServerSnapshot() {
  return initialSnapshot;
}

export function updateMessagePreview(
  update: (current: PreviewConversation[]) => PreviewConversation[],
) {
  const current = JSON.parse(getMessagePreviewSnapshot()) as PreviewConversation[];
  const next = update(current);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function postTimeInCheckIn(timeIn: number) {
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timeIn));
  const conversations = JSON.parse(getMessagePreviewSnapshot()) as PreviewConversation[];
  const checkInChannel = conversations.find(
    ({ kind, isCheckInChannel }) => kind === "channel" && isCheckInChannel,
  );
  if (!checkInChannel) return;

  updateMessagePreview((current) =>
    current.map((conversation) => {
      if (conversation.kind !== "channel" || !conversation.isCheckInChannel) {
        return conversation;
      }

      const message: PreviewMessage = {
        id: timeIn,
        text: "Good morning - Check in",
        fromMe: true,
        time,
      };

      return {
        ...conversation,
        lastMessage: message.text,
        time,
        messages: [...conversation.messages, message],
      };
    }),
  );
}

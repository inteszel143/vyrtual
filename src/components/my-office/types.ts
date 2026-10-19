export type ConnectionState = "connected" | "reconnecting" | "disconnected";
export type OfficePresence =
  | "Working"
  | "Offline"
  | "Away"
  | "Break"
  | "Meal Break"
  | "Meeting"
  | "Snoozed"
  | "Do not disturb";

export type OfficeParticipant = {
  avatarUrl?: string;
  live?: boolean;
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  gradient: string;
  state: string;
  presence: OfficePresence;
  room?: string;
  trackedToday?: string;
  isLocal?: boolean;
};

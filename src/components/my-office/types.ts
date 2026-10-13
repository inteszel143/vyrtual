export type ConnectionState = "connected" | "reconnecting" | "disconnected";
export type OfficePresence = "Working" | "Offline" | "Away" | "Break";

export type OfficeParticipant = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  gradient: string;
  state: string;
  presence: OfficePresence;
  room?: string;
  isLocal?: boolean;
};

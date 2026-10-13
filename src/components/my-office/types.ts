export type ConnectionState = "connected" | "reconnecting" | "disconnected";

export type OfficeParticipant = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  gradient: string;
  state: string;
  room?: string;
  isLocal?: boolean;
};

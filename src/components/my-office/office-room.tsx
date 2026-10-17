"use client";
import MemberOffice from "./member-office";
import { OfficeRoomContent } from "./office-room-content";
export default function OfficeRoom({ ownerView = false }: { ownerView?: boolean }) {
  return ownerView ? <OfficeRoomContent ownerView /> : <MemberOffice />;
}

import PersonalWorkspaceShell from "@/components/personal-workspace-shell";
import PersonalSchedule from "@/components/personal-schedule";
export default function MySchedulePage() {
  return <PersonalWorkspaceShell activeHref="/my-schedule" title="My schedule" description="Plan your work hours, meetings, and personal time off."><PersonalSchedule /></PersonalWorkspaceShell>;
}

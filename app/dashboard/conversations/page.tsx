import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ConversationsOverview } from "@/components/dashboard/conversations-overview"

export default function ConversationsPage() {
  return (
    <DashboardLayout>
      <ConversationsOverview />
    </DashboardLayout>
  )
}

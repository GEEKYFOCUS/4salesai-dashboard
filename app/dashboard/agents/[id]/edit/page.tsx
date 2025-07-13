import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EditAgentForm } from "@/components/dashboard/edit-agent-form"

export default function EditAgentPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <EditAgentForm agentId={params.id} />
    </DashboardLayout>
  )
}

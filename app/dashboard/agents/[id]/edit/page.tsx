import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EditAgentForm } from "@/components/dashboard/edit-agent-form"

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const {id}  = await params 
  console.log(id)
  return (
      <EditAgentForm agentId={id} />
  
  )
}

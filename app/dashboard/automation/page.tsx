import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AutomationWorkflows } from "@/components/dashboard/automation-workflows"

export default function AutomationPage() {
  return (
    <DashboardLayout>
      <AutomationWorkflows />
    </DashboardLayout>
  )
}

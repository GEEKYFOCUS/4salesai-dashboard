import { AgentsProvider } from "@/components/dashboard/agents-context"

export default function DashboardLayout({ children }) {
  return (
    <AgentsProvider>
      {children}
    </AgentsProvider>
  )
} 
"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Bot, HelpCircle, Home, LogOut, MessageSquare, Phone, Rocket, Settings, Upload } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    permission: null,
  },
  {
    title: "AI Agents",
    url: "/dashboard/agents",
    icon: Bot,
    permission: null,
  },
  {
    title: "Training Content",
    url: "/dashboard/training",
    icon: Upload,
    permission: null,
  },
  {
    title: "Conversations",
    url: "/dashboard/conversations",
    icon: MessageSquare,
    permission: null,
  },
  {
    title: "Automation",
    url: "/dashboard/automation",
    icon: Phone,
    permission: null,
  },
  {
    title: "Deployment",
    url: "/dashboard/deployment",
    icon: Rocket,
    permission: null,
  },
]

const settingsItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    permission: null,
  },
  {
    title: "Help & Support",
    url: "/dashboard/help",
    icon: HelpCircle,
    permission: null,
  },
]

interface AppSidebarProps {
  collapsed: boolean
}

export function AppSidebar({ collapsed }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredNavigationItems = navigationItems.filter((item) => !item.permission || hasPermission(item.permission))
  const filteredSettingsItems = settingsItems.filter((item) => !item.permission || hasPermission(item.permission))

  const NavButton = ({ item, isActive }: { item: (typeof navigationItems)[0]; isActive: boolean }) => {
    const button = (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 h-10",
          collapsed && "justify-center px-2",
          isActive && "bg-blue-100 text-blue-700 hover:bg-blue-100",
        )}
        onClick={() => router.push(item.url)}
      >
        <item.icon className="h-4 w-4 flex-shrink-0" />
        {!collapsed && <span className="truncate">{item.title}</span>}
      </Button>
    )

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return button
  }

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={cn("flex items-center gap-2 p-4 border-b border-gray-200", collapsed && "justify-center px-2")}>
          <Bot className="h-8 w-8 text-blue-600 flex-shrink-0" />
          {!collapsed && <span className="text-xl font-bold text-gray-900">4SalesAI</span>}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-2 py-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Navigation</h2>
              </div>
            )}
            {filteredNavigationItems.map((item) => (
              <NavButton key={item.title} item={item} isActive={pathname === item.url} />
            ))}
          </div>

          {/* Settings */}
          <div className="mt-6 space-y-1">
            {!collapsed && (
              <div className="px-2 py-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h2>
              </div>
            )}
            {filteredSettingsItems.map((item) => (
              <NavButton key={item.title} item={item} isActive={pathname === item.url} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-2">
          {user && !collapsed && (
            <div className="px-2 py-1 text-xs text-gray-500">
              {user.name} ({user.role})
            </div>
          )}
          <div className="mt-1">
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="w-full h-10">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Sign Out</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2 h-10">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

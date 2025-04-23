import { Building, LayoutDashboard, User, ChartPie, Settings, Logs, Bell, MessageCircle } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/agent/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    url: "/agent/profile",
    icon: User,
  },
  {
    title: "My properties",
    url: "/agent/my_properties",
    icon: User,
  },
  {
    title: "Rented Property",
    url: "/agent/rented-property",
    icon: Building,
  },
  {
    title: "Maintenance Report ",
    url: "/agent/reports",
    icon: ChartPie,
  },
  {
    title: "Notification",
    url: "/agent/notification",
    icon: Bell,
  },
  {
    title: "Messages",
    url: "/agent/chat",
    icon: MessageCircle,
  },
  {
    title: "Invoice",
    url: "/agent/invoices",
    icon: Logs,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Estate Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon  />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

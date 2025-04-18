import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import Header from "@/components/header"
import DashBoard from "./(Admin)/dashboard/page"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   <>
   <DashBoard />
   </>
  )
}


import { SidebarTrigger } from "./ui/sidebar"

function Header() {
  return (
   <main  className="w-full sticky top-0 h-[7vh] pr-10 flex items-center justify-between bg-red-200">
    <SidebarTrigger />
    <p>
        Hello Navs
    </p>

   </main>
  )
}

export default Header

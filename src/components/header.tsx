"use client";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Bell, Search, User, Settings, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

function Header() {
  const pathname = usePathname();
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Property Overview";
      case "/notification":
        return "Notifications";
      case "/chat":
        return "Messages";
      case "/properties":
        return "Property Management";
      case "/tenants":
        return "Tenant Management";
      case "/invoices":
        return "Rent Payments";
      case "/reports":
        return "Maintenance Requests";
      case "/rented-property":
        return "Rented Properties";
      default:
        return "Linux Homes";
    }
  };

  return (
    <SidebarProvider>
      <header className="w-full sticky top-0 h-16 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties, tenants..."
              className="pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>

          <div className="flex items-center space-x-2 ml-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <span className="hidden lg:inline text-sm font-medium text-gray-700">
              Admin
            </span>
          </div>
        </div>
      </header>
    </SidebarProvider>
  );
}

export default Header;

"use client";

import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Bell, Search, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/context/auth_context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
  };

  // Get user initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?._id} alt={user?.name} />
                <AvatarFallback>
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <Link href={"/agent/profile"}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
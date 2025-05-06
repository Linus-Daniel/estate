"use client";

import { Bell, User, HelpCircle, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/context/auth_context";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

interface TenantHeaderProps {
  onMenuToggle: () => void;
  isMobile: boolean;
}

export default function TenantHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
    
          
          {/* Portal title */}
          <h1 className="text-lg hidden md:block  font-semibold truncate max-w-[180px] sm:max-w-none">
            Dashboard
          </h1>
        </div>

        {/* User controls with better spacing constraints */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/help">
              <HelpCircle className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Help</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 px-2 rounded-full flex items-center gap-2 hover:bg-gray-100"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  {user ? (
                    <User className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  )}
                </div>
                {user && (
                  <span className="hidden sm:inline font-medium text-sm truncate max-w-[120px]">
                    {user.name}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/user/" className="w-full">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/user/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => logout()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
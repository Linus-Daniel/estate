// components/layout/TenantSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Wrench,
  Settings,
  MessageSquare,
  Calendar,
  DollarSign,
  CreditCard,
  HelpCircle,
} from "lucide-react";

const tenantNavItems = [
  { name: "Dashboard", href: "/tenant", icon: Home },
  { name: "My Lease", href: "/tenant/lease", icon: FileText },
  { name: "Maintenance", href: "/tenant/maintenance", icon: Wrench },
  { name: "Pay Rent", href: "/tenant/pay", icon: DollarSign },
  { name: "Find Apartment", href: "/tenant/findhome", icon: DollarSign },

  { name: "Payment History", href: "/tenant/payments", icon: CreditCard },
  { name: "Messages", href: "/tenant/messages", icon: MessageSquare },
  { name: "Calendar", href: "/tenant/calendar", icon: Calendar },
  { name: "Help Center", href: "/tenant/help", icon: HelpCircle },
  { name: "Settings", href: "/tenant/settings", icon: Settings },
];

export default function TenantSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
          <Link href="/tenant" className="flex items-center">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Tenant Portal
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col overflow-y-auto">
          <div className="space-y-1 px-2 py-4">
            {tenantNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    pathname === item.href
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

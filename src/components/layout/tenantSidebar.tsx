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
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const userNavItems = [
  { name: "Dashboard", href: "/user", icon: Home },
  { name: "My Lease", href: "/user/lease", icon: FileText },
  { name: "Maintenance", href: "/user/maintenance", icon: Wrench },
  { name: "Pay Rent", href: "/user/pay", icon: DollarSign },
  { name: "Find Apartment", href: "/user/findhome", icon: DollarSign },
  {
    name: "Transactions History",
    href: "/user/transactions",
    icon: CreditCard,
  },
  { name: "Chats", href: "/user/chats", icon: MessageSquare },
  { name: "Calendar", href: "/user/calendar", icon: Calendar },
  { name: "Help Center", href: "/user/help", icon: HelpCircle },
  { name: "Settings", href: "/user/settings", icon: Settings },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Tailwind's lg breakpoint
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderDesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-indigo-100 bg-gradient-to-b from-indigo-50 to-white">
        {/* Logo */}
        <div className="flex items-center h-20 flex-shrink-0 px-6 border-b border-indigo-100 bg-indigo-600">
          <Link href="/user" className="flex items-center">
            <Home className="h-8 w-8 text-white" />
            <span className="ml-3 text-xl font-bold text-white">
              User Portal
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col overflow-y-auto py-6">
          <div className="space-y-1 px-4">
            {userNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-indigo-100 text-indigo-700 shadow-sm"
                    : "text-indigo-900 hover:text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    pathname === item.href
                      ? "text-indigo-600"
                      : "text-indigo-400 group-hover:text-indigo-500"
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

  const renderMobileMenuButton = () => (
    <div className="lg:hidden fixed top-4 left-4 z-20">
      <button
        onClick={toggleMobileMenu}
        className="p-2 rounded-lg text-indigo-700 bg-white shadow-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
    </div>
  );

  const renderMobileSidebar = () => (
    <>
      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-indigo-900 bg-opacity-30 backdrop-blur-sm z-10 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gradient-to-b from-indigo-50 to-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-indigo-100 bg-indigo-600">
            <Link
              href="/user"
              className="flex items-center"
              onClick={toggleMobileMenu}
            >
              <Home className="h-8 w-8 text-white" />
              <span className="ml-3 text-xl font-bold text-white">
                User Portal
              </span>
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-white hover:bg-indigo-700 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col overflow-y-auto py-6">
            <div className="space-y-1 px-4">
              {userNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={toggleMobileMenu}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-indigo-100 text-indigo-700 shadow-sm"
                      : "text-indigo-900 hover:text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      pathname === item.href
                        ? "text-indigo-600"
                        : "text-indigo-400 group-hover:text-indigo-500"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );

  return (
    <>
      {renderDesktopSidebar()}
      {isMobile && renderMobileMenuButton()}
      {isMobile && renderMobileSidebar()}
    </>
  );
}

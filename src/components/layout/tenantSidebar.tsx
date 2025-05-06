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
  { name: "Transactions History", href: "/user/transactions", icon: CreditCard },
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
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
          <Link href="/user" className="flex items-center">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              User Portal
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col overflow-y-auto">
          <div className="space-y-1 px-2 py-4">
            {userNavItems.map((item) => (
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

  const renderMobileMenuButton = () => (
    <div className="lg:hidden fixed top-4 left-4 z-20">
      <button
        onClick={toggleMobileMenu}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
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
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}
      
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/user" className="flex items-center" onClick={toggleMobileMenu}>
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                User Portal
              </span>
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col overflow-y-auto">
            <div className="space-y-1 px-2 py-4">
              {userNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={toggleMobileMenu}
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
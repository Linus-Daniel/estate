// src/components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Home, MessageSquare, DollarSign, Settings, Menu, X } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/admin/', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Properties', href: '/admin/properties', icon: Home },
  { name: 'Chat', href: '/admin/chat', icon: MessageSquare },
  { name: 'Revenue', href: '/admin/revenue', icon: DollarSign },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 p-4 border-b">
          <div className="font-bold text-xl text-blue-600 dark:text-blue-400">RealEstate Admin</div>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@realestate.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
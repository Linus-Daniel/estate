// src/components/layout/Navbar.tsx
'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const title = pathname.split('/').pop() || 'Dashboard';
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b">
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-xl font-bold">{formattedTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-48 md:w-64"
            />
          </div>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="ml-2">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
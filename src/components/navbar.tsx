'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiInfo, FiHelpCircle, FiMap } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/', icon: <FiHome /> },
    { name: 'Properties', href: '/properties', icon: <FiMap /> },
    { name: 'About', href: '/about', icon: <FiInfo /> },
    { name: 'FAQ', href: '/faq', icon: <FiHelpCircle /> },
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          EstateFlow
        </Link>
        <div className="hidden md:flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 transition-colors ${
                pathname === link.href
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
        <button className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
          Sign In
        </button>
      </div>
    </motion.nav>
  );
}
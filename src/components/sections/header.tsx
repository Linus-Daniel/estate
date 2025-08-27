"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiHome,
  FiSearch,
  FiUser,
  FiHeart,
  FiMessageSquare,
} from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth_context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { User, Settings, LogOut, Star, Home } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHomepage, setIsHomepage] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { isAuthenticated, user, logout } = useAuth();

  // Check if current route is homepage
  useEffect(() => {
    setIsHomepage(pathname === "/");
  }, [pathname]);

  // Handle scroll effects
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const navItems = [
    { name: "Home", url: "/", icon: <FiHome className="mr-2" /> },
    {
      name: "Properties",
      url: "/findhomes",
      icon: <FiSearch className="mr-2" />,
    },
    { name: "Agents", url: "/agents", icon: <FiUser className="mr-2" /> },
    { name: "Blog", url: "/blogs", icon: <FiMessageSquare className="mr-2" /> },
    { name: "Contact", url: "/contact-us", icon: <FiHeart className="mr-2" /> },
  ];

  const handleAuthNavigation = () => {
    router.push("/auth");
  };

  // Dynamic background variants
  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      backgroundColor: "rgba(255, 255, 255, 1)",
      boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "none",
    },
  };

  return (
    <motion.header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
      initial="hidden"
      animate="visible"
      variants={backgroundVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="text-2xl font-bold text-green-700 flex items-center"
            >
              <div className="bg-green-100 p-2 rounded-lg mr-2">
                <Home className="h-6 w-6 text-green-600" />
              </div>
              <span>NaijaHomes</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Link
                    href={item.url}
                    className={`font-medium transition-colors flex items-center py-2 ${
                      pathname === item.url
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-700 hover:text-green-600"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 ml-4">
              {!isAuthenticated ? (
                <>
                  <motion.button
                    onClick={handleAuthNavigation}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 rounded-lg font-medium bg-white text-green-700 border border-green-700 hover:bg-green-50 transition-colors"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={handleAuthNavigation}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 rounded-lg font-medium bg-green-700 text-white hover:bg-green-800 transition-colors shadow-md"
                  >
                    Sign Up
                  </motion.button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                  >
                    <FiHeart className="h-5 w-5" />
                  </motion.button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 px-2 rounded-full flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200"
                      >
                        <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-700">
                          {user ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Skeleton className="h-8 w-8 rounded-full" />
                          )}
                        </div>
                        {user && (
                          <span className="hidden sm:inline font-medium text-sm truncate max-w-[120px] text-gray-700">
                            {user.name}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <div className="flex items-center justify-start p-2 border-b">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <DropdownMenuItem className="cursor-pointer p-3">
                        <Link
                          href={`${
                            user?.role === "agent"
                              ? "/agent/dashboard"
                              : "/user"
                          }`}
                          className="flex items-center w-full"
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer p-3">
                        <Link
                          href="/favorites"
                          className="flex items-center w-full"
                        >
                          <Star className="mr-2 h-4 w-4" />
                          <span>Favorites</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer p-3">
                        <Link
                          href="/settings"
                          className="flex items-center w-full"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer p-3 text-red-600 focus:text-red-600"
                        onClick={() => logout()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`md:hidden focus:outline-none p-2 rounded-lg ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            height: isOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 bg-white rounded-lg shadow-xl mt-4 border border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.url}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-200">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      handleAuthNavigation();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center"
                  >
                    <FiUser className="mr-2" />
                    Login
                  </button>
                  <button
                    onClick={() => {
                      handleAuthNavigation();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center"
                  >
                    <FiUser className="mr-2" />
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`${
                      user?.role === "agent" ? "/agent/dashboard" : "/user"
                    }`}
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;

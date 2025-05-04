"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { FiMenu, FiX, FiHome, FiSearch, FiUser, FiHeart } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth_context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { User } from "lucide-react";
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
    { name: "Home", url: "/" },
    { name: "Properties", url: "/findhomes" },
    { name: "Agents", url: "/agents" },
    { name: "Blogs", url: "/blogs" },
    { name: "Contacts", url: "/contact-us" },
  ];

  const handleAuthNavigation = () => {
    router.push("/auth");
  };

  // Dynamic background variants
  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    scrolled: { 
      backgroundColor: "rgba(255, 255, 255, 1)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    }
  };

  return (
    <motion.header
      className={`fixed p-2 w-full z-50 ${isHomepage ? "" : "bg-white shadow-md"}`}
      initial="hidden"
      animate={["visible", scrolled ? "scrolled" : ""]}
      variants={backgroundVariants}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background overlay - only on homepage */}
      {isHomepage && (
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: scrolled ? 0 : 1,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)"
          }}
          transition={{ duration: 0.5 }}
        />
      )}

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            <Link href="/" className={`${isHomepage && !scrolled ? "text-white" : "text-primary"}`}>
              Linux Homes
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.url}
                    className={`font-medium transition-colors ${
                      isHomepage && !scrolled
                        ? "text-white hover:text-primary-200"
                        : "text-gray-700 hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div>
              {!isAuthenticated ? (
                <div className="flex space-x-4 ml-8">
                  <motion.button
                    onClick={handleAuthNavigation}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-md font-medium ${
                      isHomepage && !scrolled
                        ? "bg-white text-primary hover:bg-gray-100"
                        : "bg-primary text-white hover:bg-primary-600"
                    } transition-colors`}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={handleAuthNavigation}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full font-medium border-2 ${
                      isHomepage && !scrolled
                        ? "border-white text-white hover:bg-white hover:bg-opacity-10"
                        : "border-primary text-primary hover:bg-primary hover:bg-opacity-10"
                    } transition-colors`}
                  >
                    Signup
                  </motion.button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`relative h-9 px-2 rounded-full flex items-center gap-2 ${
                        isHomepage && !scrolled ? "hover:bg-white hover:bg-opacity-20" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        isHomepage && !scrolled ? "bg-white bg-opacity-20" : "bg-blue-100"
                      }`}>
                        {user ? (
                          <User className={`h-4 w-4 ${
                            isHomepage && !scrolled ? "text-white" : "text-blue-600"
                          }`} />
                        ) : (
                          <Skeleton className="h-8 w-8 rounded-full" />
                        )}
                      </div>
                      {user && (
                        <span className={`hidden sm:inline font-medium text-sm truncate max-w-[120px] ${
                          isHomepage && !scrolled ? "text-white" : "text-gray-700"
                        }`}>
                          {user.name}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href={`${user?.role === "agent"?"/agent/dashboard":"/user"}`} className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/settings" className="w-full">
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
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden focus:outline-none ${
              isHomepage && !scrolled ? "text-white" : "text-gray-700"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.url}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  handleAuthNavigation();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => {
                  handleAuthNavigation();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
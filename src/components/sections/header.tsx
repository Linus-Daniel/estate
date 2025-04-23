"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiSearch, FiUser, FiHeart } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthNavigation = () => {
    router.push('/auth');
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-primary"
          >
            Linux Homes
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {['Home', 'Properties', 'Pages', 'Blog', 'Contacts'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{ scale: 1.05, color: '#F72585' }}
                  className={`text-gray-100 ${scrolled && "text-gray-700"} hover:text-accent font-medium transition-colors`}
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex space-x-4 ml-8">
              <motion.button
                onClick={handleAuthNavigation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md font-medium ${scrolled ? 'bg-primary text-white' : 'bg-white text-primary'} hover:bg-opacity-90 transition-colors`}
              >
                Login
              </motion.button>
              <motion.button
                onClick={handleAuthNavigation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full font-medium ${scrolled ? 'border-primary rounded-full  text-primary border-[2px]' : 'bg-white text-primary'} hover:bg-opacity-90 transition-colors`}
              >
                signup
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
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
            {['Home', 'Properties', 'Pages', 'Blog', 'Contacts'].map((item) => (
              <a
                key={item}
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
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
    </header>
  );
};

export default Header;
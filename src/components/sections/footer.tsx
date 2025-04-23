"use client"
import { motion } from 'framer-motion';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Home Lengo</h3>
            <p className="text-gray-400 mb-6">
              Discover your dream home effortlessly. Explore diverse properties with expert guidance for a seamless experience.
            </p>
            <div className="flex space-x-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['About Us', 'Services', 'Properties', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Property Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Property Types</h3>
            <ul className="space-y-3">
              {['Houses', 'Villas', 'Apartments', 'Offices', 'Townhouses', 'Commercial'].map((type) => (
                <li key={type}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {type}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter to get updates on new properties.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg bg-white focus:outline-none text-gray-900 w-full"
              />
              <button 
                type="submit" 
                className="bg-primary px-4 py-2 rounded-r-lg hover:bg-opacity-90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Home Lengo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
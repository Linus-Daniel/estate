"use client";
import { motion } from "framer-motion";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
} from "react-icons/fi";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate subscription success
      setIsSubscribed(true);
      setEmail("");
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-600 p-2 rounded-lg mr-3">
                <FiMapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">NaijaHomes</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for finding dream homes across Nigeria. From
              Lagos to Abuja, we connect you with the perfect properties.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: FiFacebook, url: "#", color: "hover:text-blue-400" },
                { icon: FiTwitter, url: "#", color: "hover:text-blue-300" },
                { icon: FiInstagram, url: "#", color: "hover:text-pink-400" },
                { icon: FiLinkedin, url: "#", color: "hover:text-blue-500" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  className="text-gray-400 transition-colors duration-300 p-2 bg-gray-800 rounded-full"
                  whileHover={{ scale: 1.1, backgroundColor: "#374151" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
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
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                "About Us",
                "Services",
                "Properties",
                "Agents",
                "Blog",
                "Contact",
              ].map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-1 h-1 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Nigerian Cities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">
              Popular Cities
            </h3>
            <ul className="space-y-3">
              {[
                "Lagos",
                "Abuja",
                "Port Harcourt",
                "Ibadan",
                "Kano",
                "Enugu",
                "Benin City",
                "Abeokuta",
              ].map((city) => (
                <li key={city}>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-1 h-1 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Properties in {city}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">
              Contact Info
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <FiMapPin className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  24A Adeola Odeku St, Victoria Island, Lagos
                </span>
              </div>
              <div className="flex items-center">
                <FiPhone className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">+234 (0) 812 345 6789</span>
              </div>
              <div className="flex items-center">
                <FiMail className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">info@naijahomes.ng</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Get updates on new properties and market trends in Nigeria
            </p>

            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-green-900 text-green-100 rounded-lg text-sm"
              >
                ✅ Thank you for subscribing!
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col space-y-2"
              >
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 w-full text-white placeholder-gray-500"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <FiSend className="mr-2" />
                  Subscribe
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} NaijaHomes. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-green-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              Cookie Policy
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              Sitemap
            </a>
          </div>
        </motion.div>

        {/* Nigerian Real Estate Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-8 pt-4 border-t border-gray-800"
        >
          <p className="text-gray-500 text-xs">
            Proudly serving the Nigerian real estate market • Verified
            properties • Trusted by thousands of Nigerians
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

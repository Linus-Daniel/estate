"use client"
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center bg-gray-100 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/images/houses/bg.jpg')] bg-cover bg-center" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Indulge In Your <span className="">Sanctuary</span>
          </h1>
          <p className="text-xl text-white mb-8">
            Discover your private oasis to the perfect home. Our curated selection of properties will help you find your dream space.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-3 rounded-full flex items-center space-x-2"
          >
            <span>Contact us</span>
            <FiArrowRight />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

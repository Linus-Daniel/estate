"use client";
import { motion } from "framer-motion";
import { FiArrowRight, FiHome, FiMapPin, FiShield } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('/images/african-pattern.png')] bg-repeat opacity-[0.03]"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 mb-6"
            >
              <FiMapPin className="mr-2" />
              <span className="text-sm font-medium">
                Lagos • Abuja • Port Harcourt
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Dream Home <span className="text-green-600">In Nigeria</span>{" "}
              Is Waiting
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-2xl">
              Discover beautiful homes across Nigeria's vibrant cities. From
              modern apartments in Lagos to spacious family houses in Abuja -
              find your perfect space with trusted local expertise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Find Your Home</span>
                <FiArrowRight />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full flex items-center justify-center space-x-2 border border-gray-200 shadow-sm"
              >
                <span>List Your Property</span>
              </motion.button>
            </div>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FiHome className="text-green-600" />
                </div>
                <span className="text-gray-700">10,000+ Properties</span>
              </div>
              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-full mr-3">
                  <FiShield className="text-amber-600" />
                </div>
                <span className="text-gray-700">Verified Listings</span>
              </div>
            </div>
          </motion.div>

          {/* Image/content slider */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex-1 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <img
                src="/images/houses/kano.jpg"
                alt="Beautiful Nigerian home"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-semibold">
                  Victoria Island Luxury Apartment
                </h3>
                <p className="flex items-center">
                  <FiMapPin className="mr-1" />
                  <span>Lagos, Nigeria</span>
                </p>
              </div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg max-w-xs"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <FiHome className="text-green-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold">Find Your Match</h4>
                  <p className="text-sm text-gray-600">
                    98% of users find a home within 2 weeks
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-gray-600 mb-2 text-sm">Explore homes</span>
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

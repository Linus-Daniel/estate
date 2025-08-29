"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiArrowRight, FiMapPin, FiHome } from "react-icons/fi";

const cities = [
  {
    name: "Lagos",
    properties: 1243,
    image: "/images/houses/lagos.jpeg",
    description: "Nigeria's economic hub with vibrant properties",
  },
  {
    name: "Abuja",
    properties: 876,
    image: "/images/houses/abuja.jpeg",
    description: "Beautiful capital city with modern developments",
  },
  {
    name: "Port Harcourt",
    properties: 542,
    image: "/images/houses/port.jpeg",
    description: "Oil-rich city with growing real estate market",
  },
  {
    name: "Ibadan",
    properties: 487,
    image: "/images/houses/ibadan.jpeg",
    description: "Historical city with affordable housing options",
  },
  {
    name: "Kano",
    properties: 398,
    image: "/images/houses/kno.jpeg",
    description: "Northern commercial center with traditional homes",
  },
  {
    name: "Enugu",
    properties: 325,
    image: "/images/houses/enugu.jpeg",
    description: "Picturesque city with cool climate properties",
  },
  {
    name: "Benin City",
    properties: 287,
    image: "/images/houses/benin.jpeg",
    description: "Cultural heritage city with diverse properties",
  },
  {
    name: "Abeokuta",
    properties: 264,
    image: "/images/houses/aje.jpeg",
    description: "Rock city with expanding suburban developments",
  },
  {
    name: "Uyo",
    properties: 219,
    image: "/images/houses/uyo.jpeg",
    description: "Fast-growing capital with modern infrastructure",
  },
];

const Cities = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 mb-4">
            <FiMapPin className="mr-2" />
            <span className="text-sm font-medium">Explore Nigerian Cities</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Properties Across Nigeria
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover homes in Nigeria's most vibrant cities. From Lagos
            apartments to Abuja villas, find your perfect space.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">{city.name}</h3>
                  <div className="flex items-center text-green-200">
                    <FiHome className="mr-1" />
                    <span>{city.properties} properties</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-5">{city.description}</p>
                <button className="flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors">
                  <span>Explore {city.name} Properties</span>
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium flex items-center justify-center mx-auto shadow-md hover:shadow-lg transition-all">
            <span>View All Nigerian Cities</span>
            <FiArrowRight className="ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Cities;

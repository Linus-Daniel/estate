'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';

const cities = [
  { name: 'Dallas', properties: 263, image: '/images/cities/city1.jpg'},
  { name: 'Miami', properties: 263, image: '/images/cities/city2.jpg'},
  { name: 'Seattle', properties: 263, image: '/images/cities/city3.webp' },
  { name: 'Denver', properties: 263, image: '/images/cities/city4.jpg'},
  { name: 'Houston', properties: 263, image: '/images/cities/city5.jpg' },
  { name: 'Atlanta', properties: 263, image: '/images/cities/city6.webp' },
  { name: 'Orlando', properties: 263, image: '/images/cities/city7.webp' },
  { name: 'Phoenix', properties: 263, image: '/images/cities/city8.webp' },
  { name: 'Austin', properties: 263, image: '/images/cities/city9.avif'},
];

const Cities = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Properties By Cities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our properties in these popular city city1.jpgcountry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex  sm:flex-row"
            >
              <Image
                src={city.image}
                alt={city.name}
                width={150}
                height={100}
                className=" rounded-l-xl sm:rounded-l-xl sm:rounded-tr-none"
              />
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{city.name}</h3>
                <p className="text-gray-600 mb-4">{city.properties} properties</p>
                <button className="text-primary flex items-center space-x-1">
                  <span>Explore Now</span>
                  <FiArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cities;

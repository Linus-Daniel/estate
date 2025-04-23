"use client"
import { motion } from 'framer-motion';
import { FiHeart, FiMapPin, FiHome, FiLayers } from 'react-icons/fi';

interface PropertyCardProps {
  title: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  location: string;
  featured?: boolean;
  image: string;
}

const PropertyCard = ({
  title,
  price,
  beds,
  baths,
  sqft,
  type,
  location,
  featured = false,
  image
}: PropertyCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl relative overflow-hidden shadow-lg transition-all duration-300"
    >
      {featured && (
        <div className="absolute top-4 left-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium z-10">
          Featured
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md">
          <FiHeart className="text-gray-600" />
        </button>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <span className="text-primary font-bold">{price}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FiMapPin className="mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center">
            <FiHome className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">{beds} Beds</span>
          </div>
          <div className="flex items-center">
            <FiHome className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">{baths} Baths</span>
          </div>
          <div className="flex items-center">
            <FiLayers className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">{sqft} Sqft</span>
          </div>
        </div>
        <div className="mt-4">
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {type}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
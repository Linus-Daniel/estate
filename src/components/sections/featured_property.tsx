"use client"
import { motion } from 'framer-motion';
import PropertyCard from './preoperty_card';
import Link from 'next/link';

const properties = [
  {
    title: 'Modern Apartment in Downtown',
    price: '$7250.00',
    beds: 2,
    baths: 2,
    sqft: 1150,
    type: 'Apartment',
    location: '145 Brooklyn Ave, California',
    featured: true,
    image: '/images/houses/house1.jpg'
  },
  {
    title: 'Luxury Villa with Ocean View',
    price: '$12,500.00',
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: 'Villa',
    location: 'Casa Lomas De Machali',
    featured: false,
    image: '/images/houses/house2.jpg'
  },
  {
    title: 'Cozy Studio in City Center',
    price: '$3200.00',
    beds: 1,
    baths: 1,
    sqft: 650,
    type: 'Studio',
    location: 'Downtown District',
    featured: true,
    image: '/images/houses/house3.jpg'
  },
  {
    title: 'Spacious Family House',
    price: '$9,800.00',
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: 'House',
    location: 'Suburban Neighborhood',
    featured: false,
    image: '/images/houses/house4.jpg'
  },
];

const FeaturedProperties = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-between  mb-12"
        >
          <div>
            <h2 className="text-lg md:text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
            <p className="text-gray-600">Recommended for you</p>
          </div>
          <Link href={"/findhome"} className="text-primary hover:bg-primary h-fit hover:text-white transition-all ease-in-out duration-700 border-[2px] border-primary  px-3 py-1 flex items-center justify-center rounded-full font-medium">View All</Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PropertyCard {...property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
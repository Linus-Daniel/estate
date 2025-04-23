"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiHome, FiDollarSign, FiKey } from "react-icons/fi";

const services = [
  {
    image: "/images/3dhouse1.png",
    
    title: "Buy A New Home",
    description:
      "Discover your dream home effortlessly. Explore diverse properties with expert guidance for a seamless experience.",
  },
  {
    image: "/images/3dhouse2.png",
    title: "Sell A Home",
    description:
      "Maximize your property's value with expert guidance and effective marketing to showcase its best features.",
  },
  {
    image: "/images/3dhouse3.png",

    title: "Rent A Home",
    description:
      "Find the perfect rental property that matches your unique lifestyle needs and budget.",
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            What We Do To Help You Find Your Perfect Property
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-6">
                
                  <Image src={service.image} width={150} height={50} alt="homes" />
              
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

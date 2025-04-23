"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiPhone, FiMail, FiMapPin, FiUser } from "react-icons/fi";

const agents = [
  {
    name: "Jack Halow",
    role: "CEO & Founder",
    phone: "1-333-345-6868",
    email: "themesflat@gmail.com",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    image: "/images/agents/agent1.jpg",
  },
  {
    name: "Darrell Steward",
    role: "CEO & Founder",
    phone: "1-333-345-6868",
    email: "themesflat@gmail.com",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    image: "/images/agents/agent2.jpg",
  },
  {
    name: "Theresa Webb",
    role: "CEO & Founder",
    phone: "1-333-345-6868",
    email: "themesflat@gmail.com",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    image: "/images/agents/agent3.jpg",
  },
  {
    name: "Marvin McKinney",
    role: "CEO & Founder",
    phone: "1-333-345-6868",
    email: "themesflat@gmail.com",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    image: "/images/agents/agent4.jpeg",
  },
];

const Agents = () => {
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
            Meet Our Agents
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team of experienced agents is ready to help you find your dream
            property
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white flex md:flex-row flex-col rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-full">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  width={150}
                  height={150}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-primary mb-4">{agent.role}</p>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FiPhone className="mr-2" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiMail className="mr-2" />
                      <span>{agent.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2" />
                      <span className="text-xs">{agent.address}</span>
                    </div>
                  </div>

                  <button className="mt-6 w-full bg-primary text-white py-2 rounded-lg flex items-center justify-center space-x-2">
                    <FiUser />
                    <span>View profile</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents;

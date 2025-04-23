"use client"
import { motion } from 'framer-motion';
import { teamMembers } from '@/constants';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 dark:text-white"
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          className="text-lg text-gray-600 dark:text-gray-300 mb-12"
        >
          We’re revolutionizing property management with cutting-edge technology.
        </motion.p>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8 dark:text-white">Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member:any, i:number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900 overflow-hidden">
                  {/* Replace with Image */}
                  <div className="flex items-center justify-center h-full text-3xl">
                    👤
                  </div>
                </div>
                <h3 className="font-bold text-lg dark:text-white">{member.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
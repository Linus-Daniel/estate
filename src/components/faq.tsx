'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex justify-between items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <span className="font-medium dark:text-white">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-indigo-600 dark:text-indigo-400"
        >
          ▼
        </motion.span>
      </button>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}
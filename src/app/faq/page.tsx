"use client"
import { motion } from 'framer-motion';
import FAQItem from '@/components/faq';
import { faqs } from '@/constants';

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 dark:text-white"
        >
          FAQs & Instructions
        </motion.h1>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
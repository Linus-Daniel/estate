'use client';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: Math.random() * 100, y: Math.random() * 100 }}
          animate={{
            x: [null, Math.random() * 100],
            y: [null, Math.random() * 100],
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 opacity-10 blur-xl"
        />
      ))}
    </div>
  );
}
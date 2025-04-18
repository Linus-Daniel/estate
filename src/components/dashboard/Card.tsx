"use client"
import { Details } from "@/types";
import { FC } from "react";
import { motion } from "framer-motion";

interface CardProps {
  item: Details;
  index: number;
}

const Card: FC<CardProps> = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex w-full h-24 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div
        className="w-20 h-full flex justify-center items-center"
        style={{ background: item.color }}
      >
        <item.icon color="white" size={32} />
      </div>
      <div className="flex-1 bg-white p-4 flex flex-col justify-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {item.title}
        </p>
        <p className="text-xl font-bold text-gray-800 mt-1">{item.value}</p>
      </div>
    </motion.div>
  );
};

export default Card;
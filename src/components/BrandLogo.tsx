"use client";

import { motion } from "framer-motion";

export default function BrandLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-2 select-none"
    >
      <motion.div
        animate={{ rotate: [0, 8, -8, 0] }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
      >
        ✓
      </motion.div>

      <span className="text-2xl font-bold tracking-wide text-white">
        Task Manager
      </span>
    </motion.div>
  );
}

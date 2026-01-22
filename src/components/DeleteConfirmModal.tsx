"use client";

import { motion } from "framer-motion";

export default function DeleteConfirmModal({
  title,
  onCancel,
  onConfirm,
  loading,
}: {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
                   shadow-[0_20px_80px_rgba(0,0,0,0.6)]
                   border border-black/10 dark:border-white/10 overflow-hidden"
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Accent */}
        <div className="h-1 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500" />

        <div className="p-6">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Delete task
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Are you sure you want to delete
            <span className="font-medium text-black dark:text-white">
              {" "}“{title}”
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { updateTask } from "@/services/task";
import { Task } from "@/types/task";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import CustomSelect from "@/components/CustomSelect";

export default function EditTaskModal({
  task,
  onClose,
  onUpdated,
}: {
  task: Task;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.slice(0, 10) : ""
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) newErrors.title = "Task title is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- CHANGE DETECTION ---------------- */

  const isChanged = useMemo(() => {
    return (
      title !== task.title ||
      description !== (task.description || "") ||
      priority !== task.priority ||
      dueDate !== (task.dueDate ? task.dueDate.slice(0, 10) : "")
    );
  }, [title, description, priority, dueDate, task]);

  /* ---------------- UPDATE ---------------- */

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await updateTask(task.id, {
        title: title.trim(),
        description: description || undefined,
        priority,
        dueDate: dueDate || null,
      });

      toast.success("Task updated");
      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]
                   bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
                   border border-black/10 dark:border-white/10"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Accent */}
        <div className="h-1 w-full mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-black/5 dark:border-white/10">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
              Edit task
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Update your task details
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center 
                       text-gray-500 dark:text-gray-400
                       hover:bg-black/5 dark:hover:bg-white/10 
                       hover:text-black dark:hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">

          {/* Title */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Title *
            </label>

            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              placeholder="Task title"
              className={`mt-1 w-full rounded-xl border bg-transparent px-4 py-2.5 text-sm
              text-black dark:text-white placeholder:text-gray-400 outline-none transition
              ${
                errors.title
                  ? "border-red-400 focus:ring-2 focus:ring-red-400/40"
                  : "border-gray-300/70 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/40"
              }`}
            />

            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details"
              className="mt-1 w-full rounded-xl border border-gray-300/70 dark:border-white/10
                         bg-transparent px-4 py-2.5 text-sm
                         text-black dark:text-white placeholder:text-gray-400
                         outline-none focus:ring-2 focus:ring-indigo-500/40 transition resize-none"
            />
          </div>

          {/* Priority + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Priority
              </label>

              <CustomSelect
                value={priority}
                className="text-black"
                onChange={(val: any) => setPriority(val)}
                options={[
                  { value: "LOW", label: "Low priority" },
                  { value: "MEDIUM", label: "Medium priority" },
                  { value: "HIGH", label: "High priority" },
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Due date
              </label>

              <DatePicker
                selected={dueDate ? new Date(dueDate) : null}
                onChange={(date: any) =>
                  setDueDate(date ? date.toISOString().split("T")[0] : "")
                }
                className="mt-1 w-full rounded-xl border border-gray-300/70 dark:border-white/10
                           bg-transparent px-4 py-2.5 text-sm
                           text-black dark:text-white
                           outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
                placeholderText="Select due date"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-black/5 dark:border-white/10">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 
                       hover:bg-black/10 dark:hover:bg-white/20 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading || !isChanged}
            className="px-5 py-2.5 rounded-xl font-medium
                       bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                       text-white shadow-lg shadow-indigo-500/25
                       hover:opacity-90 transition
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : isChanged ? "Save changes" : "No changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

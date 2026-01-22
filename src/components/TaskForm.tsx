"use client";

import { useState } from "react";
import { createTask } from "@/services/task";
import DatePicker from "react-datepicker";
import CustomSelect from "./CustomSelect";
import "react-datepicker/dist/react-datepicker.css";

export default function TaskForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ title?: string }>({});

  const validate = () => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Task title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await createTask({
        title: title.trim(),
        description: description || undefined,
        priority,
        dueDate: dueDate || null,
      });

      setTitle("");
      setDescription("");
      setPriority("LOW");
      setDueDate("");
      setErrors({});
      onCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

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
          placeholder="What needs to be done?"
          className={`mt-1 w-full rounded-xl border bg-transparent px-4 py-2.5 text-sm
          text-black dark:text-white placeholder:text-gray-400 outline-none transition
          ${errors.title
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
            onChange={(val) => setPriority(val)}
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

      {/* Action */}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-xl px-6 py-2.5 text-sm font-semibold
                     bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                     text-white shadow-lg shadow-indigo-500/25
                     hover:scale-[1.01] hover:shadow-xl transition
                     disabled:opacity-60 disabled:hover:scale-100"
        >
          {loading ? "Creating..." : "Create task"}
        </button>
      </div>
    </div>
  );
}

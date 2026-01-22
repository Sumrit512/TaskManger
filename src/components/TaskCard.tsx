"use client";

import { Task } from "@/types/task";
import { updateTask, deleteTask, toggleTask } from "@/services/task";
import toast from "react-hot-toast";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import EditTaskModal from "./EditTaskModal";
import { CheckCircle, RotateCcw, Pencil, Trash2 } from "lucide-react";



export default function TaskCard({
  task,
  refresh,
  onEdit,
   onDelete,
}: {
  task: Task;
  refresh: () => void;
  onEdit: (task: Task) => void;
   onDelete: (task: Task) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.slice(0, 10) : ""
  );
  const [showEdit, setShowEdit] = useState(false);


  const handleToggle = async () => {
    await toggleTask(task.id);
    toast.success("Status updated");
    refresh();
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    toast.success("Task deleted");
    refresh();
  };

  const handleUpdate = async () => {
    await updateTask(task.id, {
      title,
      description,
      priority,
      dueDate: dueDate || null,
    });
    setIsEditing(false);
    refresh();
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status === "PENDING";

  const priorityStyle =
    task.priority === "HIGH"
      ? "bg-red-500/10 text-red-400 border-red-500/30"
      : task.priority === "MEDIUM"
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      : "bg-green-500/10 text-green-400 border-green-500/30";

  /* ---------------- EDIT MODE ---------------- */

  if (isEditing) {
    return (
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 space-y-4">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg bg-transparent border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Task title"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg bg-transparent border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Description"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
            }
            className="rounded-lg bg-transparent border border-white/20 px-3 py-2 outline-none"
          >
            <option value="LOW">Low priority</option>
            <option value="MEDIUM">Medium priority</option>
            <option value="HIGH">High priority</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg bg-transparent border border-white/20 px-3 py-2 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 text-sm">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
          >
            Save changes
          </button>
        </div>
      </div>
    );
  }



/* ---------------- VIEW MODE ---------------- */

return (
  <div
    className={`bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 transition hover:bg-white/10 ${
      isOverdue ? "border-red-500/30" : ""
    }`}
  >
    {/* HEADER ROW */}
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

      {/* LEFT SIDE */}
      <div className="space-y-2 flex-1">

        {/* TITLE + BADGES */}
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-base">{task.title}</h3>

          <span
            className={`text-xs px-2 py-1 rounded-full border ${priorityStyle}`}
          >
            {task.priority}
          </span>

          {isOverdue && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
              Overdue
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-slate-400">{task.description}</p>
        )}

        {task.dueDate && (
          <p className="text-xs text-slate-400">
            Due{" "}
            {new Date(task.dueDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex sm:flex-col gap-2 items-center sm:min-w-[56px]">

  {/* TOGGLE STATUS */}
  <button
    onClick={handleToggle}
    title={task.status === "COMPLETED" ? "Mark as pending" : "Mark as completed"}
    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
  >
    {task.status === "COMPLETED" ? (
      <RotateCcw size={18} />
    ) : (
      <CheckCircle size={18} />
    )}
  </button>

  {/* EDIT */}
  <div className="group relative">
    <button
    onClick={() => onEdit(task)}
    title="Edit task"
    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
  >
    <Pencil size={18} />
  </button>

  <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition text-xs bg-black px-2 py-1 rounded text-white">
    Edit
  </span>
</div>


  {/* DELETE */}
  <button
    onClick={() => onDelete(task)}
    title="Delete task"
    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
  >
    <Trash2 size={18} />
  </button>

</div>

    </div>
    <AnimatePresence>
  {showEdit && (
    <EditTaskModal
      task={task}
      onClose={() => setShowEdit(false)}
      onUpdated={refresh}
    />
  )}
</AnimatePresence>

  </div>
);

}

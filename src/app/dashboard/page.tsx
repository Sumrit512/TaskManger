"use client";

import { useEffect, useState } from "react";
import { getTasks } from "@/services/task";
import { Task } from "@/types/task";
import TaskForm from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import EditTaskModal from "@/components/EditTaskModal";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { deleteTask } from "@/services/task";
import toast from "react-hot-toast";
import CustomSelect from "@/components/CustomSelect";
import TaskCardSkeleton from "@/components/TaskCardSkeleton";






export default function Dashboard() {
const { user, logoutUser, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const router = useRouter();
const [deletingTask, setDeletingTask] = useState<Task | null>(null);
const [deleteLoading, setDeleteLoading] = useState(false);
const [total, setTotal] = useState(0);
const limit = 5;


  const [showModal, setShowModal] = useState(false);

  const confirmDelete = async () => {
  if (!deletingTask) return;

  try {
    setDeleteLoading(true);
    await deleteTask(deletingTask.id);
    toast.success("Task deleted");
    setDeletingTask(null);
    loadTasks();
  } finally {
    setDeleteLoading(false);
  }
};


  const pending = tasks.filter(t => t.status === "PENDING").length;
  const completed = tasks.filter(t => t.status === "COMPLETED").length;
  const overdue = tasks.filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date() && t.status === "PENDING"
  ).length;

  const loadTasks = async () => {
  setLoading(true);

  const res = await getTasks({
    page,
    limit,
    status,
    search,
    sort,
  });

  setTasks(res.data.tasks);
  setTotal(res.data.total);
  setLoading(false);
};
const maxPage = Math.ceil(total / limit);
const hasNextPage = page < maxPage;
const hasPrevPage = page > 1;


  
  useEffect(() => {
    if (!user) return;
    loadTasks();
  }, [user, page, status, sort]);

  useEffect(() => {
    const delay = setTimeout(loadTasks, 400);
    return () => clearTimeout(delay);
  }, [search]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
  //       Checking authentication...
  //     </div>
  //   );
  // }
 
if (authLoading) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      Checking authentication...
    </div>
  );
}



if (!user) {
  router.replace("/login");
  return null;
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">

      {/* HEADER */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">Task Manager</h1>

          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-sm"
            >
              New Task
            </button>

            <button
              onClick={logoutUser}
              className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Pending" value={pending} />
          <StatCard label="Completed" value={completed} />
          <StatCard label="Overdue" value={overdue} danger />
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            placeholder="Search tasks..."
            className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearch(e.target.value)}
          />

<CustomSelect
    value={status}
    onChange={(val) => {
      setStatus(val);
      setPage(1);
    }}
    options={[
      { value: "", label: "All tasks" },
      { value: "PENDING", label: "Pending" },
      { value: "COMPLETED", label: "Completed" },
    ]}
    className="border-white/10 bg-white/5 text-white hover:bg-white/10 focus:ring-2 focus:ring-indigo-500/40"
  />


        <CustomSelect
    value={sort}
    onChange={(val: string) => {
      setPage(1);
      setSort(val);
    }}
    options={[
      { value: "", label: "Newest first" },
      { value: "oldest", label: "Oldest first" },
      { value: "priority", label: "High priority" },
      { value: "due", label: "Due date" },
    ]}
  />
        </div>

        {/* TASK LIST */}
        <div className="space-y-3">
        <div className="space-y-3">

  {loading &&
    Array.from({ length: 1 }).map((_, i) => (
      <TaskCardSkeleton key={i} />
    ))}

  {!loading && tasks.map((task) => (
    <TaskCard
      key={task.id}
      task={task}
      refresh={loadTasks}
      onEdit={setEditingTask}
      onDelete={setDeletingTask}
    />
  ))}

</div>

          {/* {!loading && tasks.map((task) => (
            <TaskCard
  key={task.id}
  task={task}
  refresh={loadTasks}
  onEdit={setEditingTask}
  onDelete={setDeletingTask}
/>



          ))} */}
        </div>

        {!loading && tasks.length === 0 && (
          <p className="text-center text-slate-400 mt-10">
            No tasks found. Create your first task.
          </p>
        )}

        {/* PAGINATION */}
<div className="flex justify-between items-center mt-10 text-sm">
  <button
    disabled={!hasPrevPage}
    onClick={() => setPage((p) => p - 1)}
    className={`px-4 py-2 rounded-lg transition ${
      hasPrevPage
        ? "bg-white/10 hover:bg-white/20"
        : "bg-white/5 text-slate-500 cursor-not-allowed"
    }`}
  >
    Prev
  </button>

  <span className="text-slate-400">
    Page {page} of {maxPage || 1}
  </span>

  <button
    disabled={!hasNextPage}
    onClick={() => setPage((p) => p + 1)}
    className={`px-4 py-2 rounded-lg transition ${
      hasNextPage
        ? "bg-white/10 hover:bg-white/20"
        : "bg-white/5 text-slate-500 cursor-not-allowed"
    }`}
  >
    Next
  </button>
</div>

      </div>

      {/* ADD TASK MODAL */}
    <AnimatePresence>
  {showModal && (
    <AddTaskModal
      onClose={() => setShowModal(false)}
      onCreated={() => {
        setShowModal(false);
        loadTasks();
      }}
    />
  )}
</AnimatePresence>
<AnimatePresence>
  {editingTask && (
    <EditTaskModal
      task={editingTask}
      onClose={() => setEditingTask(null)}
      onUpdated={loadTasks}
    />
  )}
</AnimatePresence>
<AnimatePresence>
  {deletingTask && (
    <DeleteConfirmModal
      title={deletingTask.title}
      loading={deleteLoading}
      onCancel={() => setDeletingTask(null)}
      onConfirm={confirmDelete}
    />
  )}
</AnimatePresence>


    </div>
  );
}

/* ---------- MODAL ---------- */
function AddTaskModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
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
        {/* Accent strip */}
        <div className="h-1 w-full bg-gradient-to-r mt-2 from-indigo-500 via-purple-500 to-pink-500" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-black/5 dark:border-white/10">
          <div>
            <h2 className="text-xl text-black font-semibold tracking-tight">
              Create new task
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Plan your work and stay focused
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center 
                       text-gray-500 dark:text-gray-400
                       hover:bg-black/5 dark:hover:bg-white/10 
                       hover:text-black dark:hover:text-white
                       transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <TaskForm onCreated={onCreated} />
        </div>
      </motion.div>
    </motion.div>
  );
}



/* ---------- STAT CARD ---------- */

function StatCard({
  label,
  value,
  danger,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 backdrop-blur bg-white/5 ${
      danger ? "border-red-500/30 text-red-400" : "border-white/10"
    }`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

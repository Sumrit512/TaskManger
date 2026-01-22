"use client";

export default function TaskCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">

      <div className="flex justify-between items-start gap-4">

        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="h-4 w-2/3 bg-white/10 rounded-md" />

          {/* Description */}
          <div className="h-3 w-full bg-white/10 rounded-md" />
          <div className="h-3 w-4/5 bg-white/10 rounded-md" />

          {/* Due date */}
          <div className="h-3 w-32 bg-white/10 rounded-md" />
        </div>

        {/* Right actions */}
        <div className="flex gap-2">
          <div className="h-8 w-14 bg-white/10 rounded-lg" />
          <div className="h-8 w-14 bg-white/10 rounded-lg" />
          <div className="h-8 w-14 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

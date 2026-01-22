import BrandLogo from "@/components/BrandLogo";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="flex flex-col items-center gap-4">
        <BrandLogo />
        <p className="text-slate-400 text-sm animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

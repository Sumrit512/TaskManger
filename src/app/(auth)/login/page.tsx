"use client";

import { useState } from "react";
import { login } from "@/services/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import Image from "next/image";
import { useRouter } from "next/navigation";







export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await login(email, password);
document.cookie = `accessToken=${res.data.accessToken}; path=/; max-age=86400; secure; samesite=lax`;
document.cookie = `refreshToken=${res.data.refreshToken}; path=/; max-age=604800; secure; samesite=lax`;

localStorage.setItem("accessToken", res.data.accessToken);
localStorage.setItem("refreshToken", res.data.refreshToken);


      toast.success("Login successful");
    
router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">

  {/* BRAND HEADER */}
  <div className="w-full py-8 flex justify-center">
  <BrandLogo />
</div>


  {/* AUTH CARD */}
  <div className="flex-1 flex items-center justify-center px-4">
 <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 overflow-hidden">
{/* BACKGROUND BRAND ICON */}
<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
  <Image
    src="/favicon.png"     // or "/favicon.png"
    alt="Task Manager"
    width={280}
    height={280}
    className="opacity-[0.07] blur-sm select-none"
    priority
  />
</div>

<div className="relative z-10">
  {/* your existing card UI */}
   <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome back
        </h1>
        <p className="text-slate-300 text-center mb-8 text-sm">
          Login to manage your tasks
        </p>

        <div className="space-y-5">

          {/* EMAIL */}
          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
            tooltip="Enter a valid registered email address"
          />

          {/* PASSWORD */}
          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            toggleShow={() => setShowPassword(p => !p)}
            error={errors.password}
            tooltip="Password is case-sensitive"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-300">
          Don’t have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Create one
          </Link>
        </div>
      </div>
</div>



       
  </div>

</div>

   
  );
}

/* ------------------ INPUT FIELD ------------------ */

function InputField({ label, value, onChange, placeholder, error, tooltip }: any) {
  return (
    <div>
      <label className="text-sm text-slate-300 block mb-1">{label}</label>

      <div className="relative group">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg bg-white/10 border px-4 py-2.5 pr-10 text-white placeholder:text-slate-400 
          focus:outline-none focus:ring-2 transition
          ${error ? "border-red-400 focus:ring-red-400/40" : "border-white/20 focus:ring-indigo-500/40"}`}
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-help">
          ?
        </span>

        <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-10">
          <div className="bg-black text-xs text-white px-3 py-2 rounded-lg shadow-xl">
            {tooltip}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

/* ------------------ PASSWORD FIELD ------------------ */

function PasswordField({
  label,
  value,
  onChange,
  show,
  toggleShow,
  error,
  tooltip,
}: any) {
  return (
    <div>
      <label className="text-sm text-slate-300 block mb-1">{label}</label>

      <div className="relative group">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className={`w-full rounded-lg bg-white/10 border px-4 py-2.5 pr-16 text-white placeholder:text-slate-400 
          focus:outline-none focus:ring-2 transition
          ${error ? "border-red-400 focus:ring-red-400/40" : "border-white/20 focus:ring-indigo-500/40"}`}
        />

        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition text-sm"
        >
          {show ? "Hide" : "Show"}
        </button>

        <div className="absolute right-10 top-full mt-2 hidden group-hover:block z-10">
          <div className="bg-black text-xs text-white px-3 py-2 rounded-lg shadow-xl">
            {tooltip}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

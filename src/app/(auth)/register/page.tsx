"use client";

import { useState } from "react";
import { register } from "@/services/auth";
import toast from "react-hot-toast";
import Link from "next/link"; 
import BrandLogo from "@/components/BrandLogo";
import Image from "next/image";



export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const nameRegex = /^[A-Za-z ]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Only alphabets allowed";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Must contain 1 uppercase, 1 number, 1 symbol and minimum 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await register(name, email, password);
      toast.success("Account created successfully");
      window.location.href = "/login";
    } catch {
      toast.error("Registration failed");
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
    width={300}
    height={300}
    className="opacity-[0.06] blur-sm select-none"
    priority
  />
</div>
<div className="relative z-10">
   <h1 className="text-3xl font-bold text-white text-center mb-2">
          Create account
        </h1>
        <p className="text-slate-300 text-center mb-8 text-sm">
          Start managing your tasks in seconds
        </p>

        <div className="space-y-5">

          {/* NAME */}
          <InputField
            label="Name"
            placeholder="Your name"
            value={name}
            onChange={setName}
            error={errors.name}
            tooltip="Only alphabets allowed"
          />

          {/* EMAIL */}
          <InputField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
            tooltip="Must be a valid email address"
          />

          {/* PASSWORD */}
          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            toggleShow={() => setShowPassword(p => !p)}
            error={errors.password}
            tooltip="Minimum 6 characters, 1 uppercase, 1 number and 1 symbol"
          />

          {/* CONFIRM PASSWORD */}
          <PasswordField
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirmPassword}
            toggleShow={() => setShowConfirmPassword(p => !p)}
            error={errors.confirmPassword}
            tooltip="Must match the password above"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Login
          </Link>
        </div>
</div>
     

      </div>
  </div>

</div>

   
    
  );
}

/* -------------------- REUSABLE INPUT -------------------- */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  error,
  tooltip,
}: any) {
  return (
    <div>
      <label className="text-sm text-slate-300 block mb-1">{label}</label>

      <div className="relative group">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg bg-white/10 border px-4 py-2.5 pr-10 text-white placeholder:text-slate-400 
          focus:outline-none focus:ring-2
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

/* -------------------- PASSWORD FIELD -------------------- */

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
          focus:outline-none focus:ring-2
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
          <div className="bg-black text-xs text-white px-3 py-2 rounded-lg shadow-xl max-w-[260px]">
            {tooltip}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

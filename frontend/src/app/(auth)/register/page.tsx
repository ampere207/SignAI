"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiBaseUrl } from "@/app/lib/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Registration successful, redirect to login
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181826] relative overflow-hidden">
      {/* Faded background layer (optional future image or pattern) */}
      <div className="absolute inset-0 opacity-10 z-0" />

      <div className="max-w-md w-full px-6 z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">SignAI</h1>
          <p className="text-[#6e7074] text-lg">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full py-4 px-4 rounded-full border border-[#6e7074] border-opacity-30 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#dd8256] focus:border-transparent"
            disabled={isLoading}
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-4 px-4 rounded-full border border-[#6e7074] border-opacity-30 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#dd8256] focus:border-transparent"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-4 px-4 rounded-full border border-[#6e7074] border-opacity-30 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#dd8256] focus:border-transparent"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full py-4 px-4 rounded-full border border-[#6e7074] border-opacity-30 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#dd8256] focus:border-transparent"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 bg-[#985BAA] hover:bg-[#985BAA]/90 text-white rounded-full transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>

          <div className="text-center mt-6">
            <p className="text-[#6e7074]">
              Already have an account?
              <Link href="/login" className="text-[#7891f5] ml-1 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
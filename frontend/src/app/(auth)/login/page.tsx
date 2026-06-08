"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiBaseUrl } from "@/app/lib/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Create URLSearchParams for form data
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${getApiBaseUrl()}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to login');
      }

      if (data?.access_token) {
        // Store token in localStorage
        localStorage.setItem("token", data.access_token);
        // Redirect to dashboard or home page
        router.push("/");
      } else {
        setError("Failed to login. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181826] relative overflow-hidden">
      {/* Faded cultural background */}
      <div className="absolute inset-0  opacity-10 z-0">

      </div>

      {/* Login Form */}
      <div className="max-w-md w-full px-6 z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">SignAI</h1>
          <p className="text-[#6e7074] text-lg">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-4 px-4 rounded-full border border-[#6e7074] border-opacity-30 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#dd8256] focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-4 px-4 rounded-full border border-[#6e7074] border-opacity-30 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#dd8256] focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div className="text-right">
            <Link href="#" className="text-[#7891f5] text-sm hover:underline">
              Forgot your password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-[#985BAA] hover:bg-[#985BAA]/90 text-white rounded-full transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-[#6e7074]">
              Don&apos;t have an account?
              <Link href="/register" className="text-[#7891f5] ml-1 hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
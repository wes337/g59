"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:6001"
    : "https://api.g59records.com";

function ResetPassword() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const email = searchParams.get("email");
  const [status, setStatus] = useState(code && email ? "ready" : "invalid");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleReset() {
    setError("");

    if (password.length < 8) {
      setError("password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("passwords do not match");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${API_URL}/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email, password }),
        credentials: "include",
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || "reset failed. this link may have expired.");
        setStatus("ready");
      }
    } catch {
      setError("something went wrong. please try again.");
      setStatus("ready");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center lowercase">
      {status === "ready" && (
        <>
          <h1 className="text-3xl font-bold mb-4 text-yellow-400">
            reset your password
          </h1>
          <p className="text-lg text-foreground/70 mb-6">
            enter your new password below.
          </p>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <input
            type="password"
            placeholder="new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full max-w-sm px-4 py-3 mb-3 bg-transparent border border-foreground/30 text-foreground font-sans normal-case focus:outline-none focus:border-foreground"
          />

          <input
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full max-w-sm px-4 py-3 mb-6 bg-transparent border border-foreground/30 text-foreground font-sans normal-case focus:outline-none focus:border-foreground"
          />

          <button
            onClick={handleReset}
            className="bg-foreground text-background px-8 py-3 text-lg font-bold font-sans normal-case cursor-pointer hover:opacity-80 transition-opacity"
          >
            Reset Password
          </button>
        </>
      )}

      {status === "loading" && (
        <p className="text-lg">resetting your password...</p>
      )}

      {status === "success" && (
        <>
          <h1 className="text-3xl font-bold mb-4">password reset</h1>
          <p className="text-lg text-foreground/70">
            your password has been updated. you can close this page and log in.
          </p>
        </>
      )}

      {status === "invalid" && (
        <>
          <h1 className="text-3xl font-bold mb-4">invalid link</h1>
          <p className="text-lg text-foreground/70">
            this reset link is missing required information.
          </p>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg">loading...</p>
        </div>
      }
    >
      <ResetPassword />
    </Suspense>
  );
}

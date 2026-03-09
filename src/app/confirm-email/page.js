"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:6001"
    : "https://api.g59records.com";

function ConfirmEmail() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const email = searchParams.get("email");
  const [status, setStatus] = useState(code && email ? "ready" : "invalid");

  async function handleConfirm() {
    setStatus("loading");

    try {
      const res = await fetch(`${API_URL}/v1/auth/confirm-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email }),
        credentials: "include",
      });

      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center lowercase">
      {status === "ready" && (
        <>
          <h1 className="text-3xl font-bold mb-4 text-yellow-400">confirm your email</h1>
          <p className="text-lg text-foreground/70 mb-6">
            click the button below to verify your email address.
          </p>
          <button
            onClick={handleConfirm}
            className="bg-foreground text-background px-8 py-3 text-lg font-bold font-sans normal-case cursor-pointer hover:opacity-80 transition-opacity"
          >
            Confirm Email
          </button>
        </>
      )}

      {status === "loading" && <p className="text-lg">verifying your email...</p>}

      {status === "success" && (
        <>
          <h1 className="text-3xl font-bold mb-4">email confirmed</h1>
          <p className="text-lg text-foreground/70">
            your email has been verified. you can close this page.
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-3xl font-bold mb-4">confirmation failed</h1>
          <p className="text-lg text-foreground/70">
            this link may have expired or already been used. try requesting a
            new confirmation email from the app.
          </p>
        </>
      )}

      {status === "invalid" && (
        <>
          <h1 className="text-3xl font-bold mb-4">invalid link</h1>
          <p className="text-lg text-foreground/70">
            this confirmation link is missing required information.
          </p>
        </>
      )}
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-lg">Loading...</p>
        </div>
      }
    >
      <ConfirmEmail />
    </Suspense>
  );
}

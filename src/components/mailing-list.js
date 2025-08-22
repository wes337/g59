"use client";

import { useEffect, useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import Cache from "@/cache";
import { isValidEmail } from "@/utils";
import { signUpForEmailList } from "@/email";

export default function MailingList() {
  const timeoutRef = useRef();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const showMailingList = async () => {
      const seenRecently = await Cache.getItem("mailing-list");

      if (seenRecently) {
        return;
      }

      timeoutRef.current = setTimeout(() => {
        setShow(true);
        Cache.setItem("mailing-list", true, 86400);
      }, 3000);
    };

    showMailingList();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const onSubmit = async (event) => {
    try {
      event.preventDefault();

      setError("");
      setLoading(true);

      if (!isValidEmail(email)) {
        setError("Invalid email address");
        return;
      }

      await signUpForEmailList(email);
      setShow(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black/50 z-50 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-all duration-300ms`}
    >
      <div
        className={`relative p-8 max-w-[400px] bg-white border-2 text-black drop-shadow-[0px_4px_8px_black] ${
          show ? "translate-y-[0%]" : "translate-y-[300%]"
        } transition-all delay-150 duration-500ms`}
      >
        <button
          className="absolute top-0 right-0 m-2 cursor-pointer"
          onClick={() => setShow(false)}
        >
          <MdClose size={24} />
        </button>
        <div className="lowercase text-3xl mb-4">
          Sign up to avoid the plague
        </div>
        <div className="font-sans text-sm tracking-tight leading-none opacity-80 mb-4">
          Get notified about exclusive content, merch, and other drops.
        </div>
        <form className="flex gap-2" onSubmit={onSubmit}>
          <input
            className="w-full border-2 font-sans p-2 text-md"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="Email"
          />
          <button
            className={`bg-black text-white w-[96px] border-2 border-black cursor-pointer lowercase tracking-wider ${
              loading ? "opacity-75" : ""
            }`}
            type="submit"
            disabled={loading}
          >
            Join
          </button>
        </form>
        {error && <div className="font-sans text-red-300 mt-2">{error}</div>}
      </div>
    </div>
  );
}

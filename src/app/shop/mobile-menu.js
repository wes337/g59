"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MdMenu, MdClose, MdArrowBack } from "react-icons/md";

export default function MobileMenu({ menuItems }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [back, setBack] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (["/", "/shop"].includes(pathname)) {
      setBack("");
    } else {
      setBack("/shop");
    }
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("noScroll");
    } else {
      document.body.classList.remove("noScroll");
    }
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      setOpen(false);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex sm:hidden">
      {back && (
        <button
          className="fixed top-0 left-0 m-2 text-white z-10 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer"
          onClick={() => router.back()}
        >
          <MdArrowBack size={40} />
        </button>
      )}
      <button
        className="fixed top-0 right-0 m-2 text-white z-10 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <MdMenu size={40} />
      </button>
      {createPortal(
        <div
          className={`fixed top-0 w-full h-full z-10 bg-black sm:hidden ${
            open ? "left-0" : "left-[-200%]"
          } transition-all duration-200`}
        >
          <button
            className={`fixed top-0 m-2 text-white z-10 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer ${
              open ? "right-0" : "right-[-200%]"
            } transition-all duration-300`}
            onClick={() => setOpen(false)}
          >
            <MdClose size={48} />
          </button>
          <div className="mt-[172px]">
            {menuItems.map((menuItem) => {
              let active = pathname.includes(
                `/shop/${menuItem.resource.handle}`
              );

              if (pathname === "/shop" && menuItem.resource.handle === "all") {
                active = true;
              }

              return (
                <Link
                  key={menuItem.id}
                  className={`group relative lowercase text-2xl leading-12 cursor-pointer hover:text-yellow-300 w-full text-center ${
                    active ? "text-yellow-300" : ""
                  }`}
                  href={`/shop/${menuItem.resource.handle}`}
                  onClick={() => setOpen(false)}
                >
                  <div
                    className={`group-hover:bg-white/10 ${
                      active ? "bg-white/5" : ""
                    }`}
                  >
                    {menuItem.resource.title}
                  </div>
                </Link>
              );
            })}
          </div>
          <div
            className={`fixed left-0 w-full text-center text-sm lowercase opacity-75 ${
              open ? "bottom-[32px]" : "bottom-[-100px]"
            } transition-all duration-200`}
          >
            Copyright © 2025 G59 Records, Inc. All Rights Reserved
          </div>
        </div>,
        document?.body
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Footer() {
  const pathname = usePathname();
  const [fixed, setFixed] = useState(null);

  useEffect(() => {
    const onResize = () => {
      const noScroll = !(
        document.documentElement.scrollHeight > window.innerHeight ||
        document.body.scrollHeight > window.innerHeight
      );

      setFixed(noScroll || pathname === "/");
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  if (fixed === null) {
    return null;
  }

  return (
    <>
      <div
        className={`${
          fixed ? "fixed bottom-0 left-0" : "mt-8"
        } flex flex-col items-center justify-center w-full h-[64px] lowercase tracking-wider drop-shadow-lg text-xs md:text-sm`}
      >
        {pathname.match("shop") && (
          <div className="flex gap-4">
            <Link
              className="text-yellow-100 text-shadow-[2px_2px_0px_black] hover:text-yellow-300"
              href="/shop/policies/terms-of-service"
            >
              Terms
            </Link>
            <Link
              className="text-yellow-100 text-shadow-[2px_2px_0px_black] hover:text-yellow-300"
              href="/shop/policies/privacy-policy"
            >
              Privacy
            </Link>
            <Link
              className="text-yellow-100 text-shadow-[2px_2px_0px_black] hover:text-yellow-300"
              href="/shop/policies/refund-policy"
            >
              Refunds
            </Link>
          </div>
        )}
        <div className="opacity-75">
          Copyright © 2025 G59 Records, Inc. All Rights Reserved
        </div>
      </div>
    </>
  );
}

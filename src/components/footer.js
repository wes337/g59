"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`${
          pathname !== "/" ? "" : "fixed bottom-0 left-0"
        } flex items-center justify-center w-full h-[64px] lowercase tracking-wider opacity-75 drop-shadow-lg text-xs md:text-sm`}
      >
        Copyright © 2025 G59 Records, Inc. All Rights Reserved
      </div>
    </>
  );
}

"use client";

import { useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { randomNumberBetween } from "@/utils";

export default function Wire({ wire }) {
  const pathname = usePathname();
  const [rotate, setRotate] = useState(0);

  useLayoutEffect(() => {
    setRotate(randomNumberBetween(0, -360));
  }, [pathname]);

  return (
    <div
      className={`wire-3 fixed z-[-1] bottom-[20%] md:bottom-0 w-[200vw] md:w-full drop-shadow-lg pointer-events-none ${
        pathname.match("shop") ? "invert" : ""
      }`}
    >
      <Image
        className="pointer-events-none"
        style={{
          transform: `rotate(${rotate}deg)`,
          transition: "all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }}
        src={`/images/wire-${wire}.png`}
        width={3840}
        height={2160}
        alt=""
      />
    </div>
  );
}

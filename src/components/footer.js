import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <>
      <div className="fixed bottom-0 left-0 flex items-center justify-center w-full h-[64px] lowercase tracking-wider text-white/75 drop-shadow-lg text-xs md:text-sm">
        Copyright © 2025 G59 Records, Inc. All Rights Reserved
      </div>
    </>
  );
}

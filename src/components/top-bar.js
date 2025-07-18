"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function TopBar() {
  const [hover, setHover] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-[148px] z-10 gap-8">
        <Link
          className="text-4xl tracking-wide hover:scale-[1.1] transition-all duration-200 drop-shadow-lg"
          href="/tour"
        >
          Tour
        </Link>
        <div className="w-[80px] md:w-[148px] h-full" />
        <Link
          className="text-4xl tracking-wide hover:scale-[1.1] transition-all duration-200 drop-shadow-lg"
          href="/shop"
        >
          Shop
        </Link>
      </div>
      <div
        className="fixed top-0 left-[50%] translate-x-[-50%] w-auto h-[148px] z-15 overflow-hidden"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <div className="h-full w-full flex items-center justify-center hover:scale-[1.1] transition-all duration-200">
          <Link className="h-full w-auto" href="/">
            <Image
              className="w-full h-full object-contain"
              src={`/images/chain-base.png`}
              alt=""
              width={1000}
              height={1000}
            />
          </Link>
        </div>
      </div>
      <Image
        className={`fixed h-[64px] w-auto top-[70px] left-[50%] translate-x-[-50%] drop-shadow-lg spinner z-16 pointer-events-none transition-all duration-200 ${
          hover ? "scale-[1.1]" : ""
        }`}
        src={`/images/chain-skull.png`}
        alt=""
        width={547}
        height={662}
      />
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { playSoundEffect, preloadImages } from "@/utils";
import Static from "@/components/static";

export default function Game() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef(null);
  const pathname = usePathname();

  const flickerStatic = (duration = 1000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const event = new CustomEvent("showstatic");
    document.dispatchEvent(event);

    timeoutRef.current = setTimeout(() => {
      const event = new CustomEvent("hidestatic");
      document.dispatchEvent(event);
    }, duration);
  };

  useEffect(() => {
    preloadImages([
      `/images/game/room-1-xl.png`,
      `/images/game/frame-desktop.png`,
      `/images/game/frame-mobile.png`,
    ]).then(() => {
      setMounted(true);
      flickerStatic();
    });
  }, []);

  if (pathname !== "/") {
    return null;
  }

  return (
    <>
      {show ? (
        <button
          className="fixed top-0 right-0 p-4 cursor-pointer text-4xl hover:text-yellow-500 z-40"
          onClick={() => {
            const game = document.getElementById("game");
            game.classList.remove("slideUp");
            game.classList.add("slideDown");
            playSoundEffect("close.mp3");

            setTimeout(() => {
              setShow(false);
            }, 1000);
          }}
        >
          X
        </button>
      ) : (
        <button
          className="fixed bottom-0 right-0 p-4 cursor-pointer text-4xl hover:text-yellow-500 z-30"
          onClick={() => {
            playSoundEffect("open.mp3");
            setShow(true);
          }}
        >
          G
        </button>
      )}

      {show && (
        <div
          id="game"
          className={`fixed top-0 left-0 w-full h-full z-35 slideUp`}
        >
          <div className="fixed top-0 left-0 w-full h-full bg-black/75 z-40 fadeIn" />
          <div className="fixed top-[50%] left-[50%] translate-[-50%] w-[75%] h-[90%] md:w-[59.5%] md:h-[70%] z-45">
            <Static />
            <div className="flickerBackground" />
            <Image
              className="min-[1921px]:hidden w-full h-full object-cover pointer-events-none select-none"
              src={`/images/game/room-1-lg.png`}
              width={1920}
              height={1080}
              alt=""
            />
            <Image
              className="hidden min-[1921px]:block w-full h-full object-cover pointer-events-none select-none"
              src={`/images/game/room-1-xl.png`}
              width={3600}
              height={2026}
              alt=""
            />
          </div>
          <div className="hidden md:block fixed top-0 left-0 w-full h-full z-50">
            <Image
              className="min-[1921px]:hidden w-full h-full object-cover pointer-events-none select-none"
              src={`/images/game/frame-desktop.png`}
              width={1920}
              height={993}
              alt=""
            />
            <Image
              className="hidden min-[1921px]:block w-full h-full object-cover pointer-events-none select-none"
              src={`/images/game/frame-desktop-xl.png`}
              width={3850}
              height={1985}
              alt=""
            />
          </div>
          <div className="block md:hidden fixed top-0 left-0 w-full h-full z-50">
            <Image
              className="w-full h-full object-cover pointer-events-none select-none"
              src={`/images/game/frame-mobile.png`}
              width={713}
              height={1251}
              alt=""
            />
          </div>
        </div>
      )}
    </>
  );
}

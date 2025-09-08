"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  playSoundEffect,
  preloadImages,
  isSmallScreen,
  randomNumberBetween,
} from "@/utils";
import Static from "@/components/static";

export default function Game() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("room-1");
  const staticTimeout = useRef(null);
  const doorTimeout = useRef(null);
  const pathname = usePathname();

  const CLICK_AREAS = {
    "room-1": [
      {
        id: "room-2-door",
        width: 5,
        height: 50,
        top: 24,
        left: 80,
        onClick: () => gotoRoom("room-2"),
      },
      {
        id: "room-3-door",
        width: 12,
        height: 60,
        top: 33,
        left: 0,
        onClick: () => gotoRoom("room-3"),
      },
    ],
    "room-2": [
      {
        id: "back-room-1",
        width: 20,
        height: 100,
        top: 0,
        left: 0,
        onClick: () => gotoRoom("room-1"),
      },
    ],
    "room-3": [
      {
        id: "back-room-1",
        width: 20,
        height: 100,
        top: 0,
        left: 80,
        onClick: () => gotoRoom("room-1"),
      },
    ],
  };

  const preloadGameAssets = async () => {
    const assets = ["/images/game/room-1-lg.png"];

    if (isSmallScreen()) {
      assets.push(`/images/game/frame-mobile.png`);
    } else {
      assets.push("/images/game/frame-desktop.png");
    }

    await preloadImages(assets);
  };

  const flickerStatic = (duration = 1000) => {
    if (staticTimeout.current) {
      clearTimeout(staticTimeout.current);
    }

    const event = new CustomEvent("showstatic");
    document.dispatchEvent(event);

    staticTimeout.current = setTimeout(() => {
      const event = new CustomEvent("hidestatic");
      document.dispatchEvent(event);
    }, duration);
  };

  useEffect(() => {
    preloadGameAssets().then(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!show) {
      return;
    }

    const loopMusic = async () => {
      if (!show) {
        return;
      }

      await playSoundEffect(`ambience-${randomNumberBetween(1, 6)}.mp3`, 0.04);
      await loopMusic();
    };

    loopMusic();
  }, [show]);

  if (pathname !== "/" || !mounted) {
    return null;
  }

  const gotoRoom = (room) => {
    if (doorTimeout.current) {
      clearTimeout(doorTimeout.current);
    }

    flickerStatic(1000);

    playSoundEffect(`static.mp3`, 0.04);
    playSoundEffect(`door-${randomNumberBetween(1, 3)}.mp3`);

    doorTimeout.current = setTimeout(() => {
      setCurrentRoom(room);
    }, 500);
  };

  return (
    <>
      {show ? (
        <button
          className="fixed top-0 right-0 p-4 cursor-pointer text-4xl hover:text-yellow-500 z-40"
          onClick={() => {
            playSoundEffect("close.mp3");

            const game = document.getElementById("game");
            game.classList.remove("slideUp");
            game.classList.add("slideDown");

            const gameBackdrop = document.getElementById("game-backdrop");
            gameBackdrop.classList.remove("fadeIn");
            gameBackdrop.classList.add("fadeOut");

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
            setTimeout(() => {
              flickerStatic(1000);
            }, 500);
          }}
        >
          G
        </button>
      )}

      <div
        id="game-backdrop"
        className={`fixed top-0 left-0 w-full h-full bg-black/75 z-30 ${
          show ? "fadeIn" : "fadeOut"
        } pointer-events-none`}
      />

      <div
        id="game"
        className={`fixed top-0 left-0 w-full h-full z-35 ${
          show ? "slideUp" : "translate-y-[-200%]"
        }`}
      >
        <div className="fixed bottom-0 md:bottom-auto md:top-[50%] left-[50%] translate-x-[-50%] translate-y-[-40%] md:translate-y-[-52.5%] w-full md:w-auto h-auto z-45 pointer-events-none">
          <Static />
          <Image
            className="absolute w-full h-full z-1 select-none pointer-events-none scale-[1.3] md:scale-[1.2] brightness-25"
            src={`/images/game/inner-frame-lg.png`}
            width={1984}
            height={1080}
            alt=""
          />
          <div
            className="min-[1921px]:hidden flickerBackground"
            style={{
              backgroundImage: `url("/images/game/${currentRoom}-lg.png")`,
            }}
          />
          <div
            className="hidden min-[1921px]:block flickerBackground"
            style={{
              backgroundImage: `url("/images/game/${currentRoom}-xl.png")`,
            }}
          />
          <Image
            className="min-[1921px]:hidden w-full h-full object-cover select-none pointer-events-none"
            src={`/images/game/${currentRoom}-lg.png`}
            width={1920}
            height={1080}
            alt=""
          />
          <Image
            className="hidden min-[1921px]:block w-full h-full object-cover select-none pointer-events-none"
            src={`/images/game/${currentRoom}-xl.png`}
            width={3600}
            height={2026}
            alt=""
          />
          <div
            id="clickArea"
            className="absolute top-0 left-0 w-full h-full z-5 pointer-events-auto"
            onPointerDown={() => {
              playSoundEffect("click-soft.mp3", 0.5);
            }}
          >
            {CLICK_AREAS[currentRoom].map((area) => {
              return (
                <button
                  key={area.id}
                  className="absolute hover:bg-white/5 cursor-pointer z-5 pointer-events-auto"
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    width: `${area.width}%`,
                    height: `${area.height}%`,
                    top: `${area.top}%`,
                    left: `${area.left}%`,
                  }}
                  onClick={() => {
                    area.onClick?.();
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="hidden md:block fixed top-0 left-0 w-full h-full z-50 pointer-events-none">
          <Image
            className="min-[1921px]:hidden w-full h-full object-fill pointer-events-none select-none drop-shadow-lg"
            src={`/images/game/frame-desktop.png`}
            width={1920}
            height={993}
            alt=""
          />
          <Image
            className="hidden min-[1921px]:block w-full h-full object-cover pointer-events-none select-none drop-shadow-lg"
            src={`/images/game/frame-desktop-xl.png`}
            width={3850}
            height={1985}
            alt=""
          />
        </div>
        <div className="block md:hidden fixed bottom-0 left-[50%] translate-x-[-50%] w-[180%] h-auto z-50 pointer-events-none">
          <Image
            className="w-full h-full object-cover pointer-events-none select-none drop-shadow-lg"
            src={`/images/game/frame-desktop.png`}
            width={713}
            height={1251}
            alt=""
          />
        </div>
      </div>
    </>
  );
}

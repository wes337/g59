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

const ITEMS = {
  "drain-cleaner": {
    useText: "Drink it",
    cancelText: "I'm not thirsty",
  },
  hammer: {
    useText: "Smash",
    cancelText: "Put it down",
  },
  mushrooms: {
    useText: "Eat them",
    cancelText: "Nah",
  },
  noose: {
    useText: "Hang",
    cancelText: "Not today",
  },
  "pick-axe": {
    useText: "Get to work",
    cancelText: "Never mind",
  },
  "spike-bat": {
    useText: "Swing it",
    cancelText: "Leave it",
  },
  "producer-list": {
    cancelText: "what the fuck?",
  },
  "soulseek-saga-vinyl": {
    cancelText: "nice",
  },
};

export default function Game() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("room-1");
  const [selectedItem, setSelectedItem] = useState(null);
  const musicRef = useRef(null);
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
      {
        id: "drain-cleaner",
        width: 5,
        height: 9,
        top: 48,
        left: 58.5,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("drain-cleaner");
        },
      },
      {
        id: "hammer",
        width: 8,
        height: 6,
        top: 69,
        left: 38.5,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("hammer");
        },
      },
      {
        id: "mushrooms",
        width: 6,
        height: 15,
        top: 60,
        left: 21.5,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("mushrooms");
        },
      },
      {
        id: "noose",
        width: 4,
        height: 25,
        top: 8,
        left: 69.5,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("noose");
        },
      },
      {
        id: "spike-bat",
        width: 4,
        height: 15,
        top: 43,
        left: 22,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("spike-bat");
        },
      },
      {
        id: "producer-list",
        width: 5,
        height: 10,
        top: 55,
        left: 92,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("producer-list");
        },
      },
      {
        id: "soulseek-saga-vinyl",
        width: 6.5,
        height: 4,
        top: 55,
        left: 50,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("soulseek-saga-vinyl");
        },
      },
      {
        id: "pick-axe",
        width: 11,
        height: 10,
        top: 69,
        left: 74,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("pick-axe");
        },
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
      {
        id: "laptop",
        width: 40,
        height: 75,
        top: 10,
        left: 33,
        onClick: () => {
          playSoundEffect("click-medium.mp3");
          startMusic("song-2.mp3");
        },
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

  const startMusic = (track = "song-1.mp3", volume = 0.1) => {
    if (!musicRef.current) {
      const music = new Audio(`/sounds/${track}`);
      music.volume = volume;
      music.loop = true;
      music.play().catch(() => {
        // Do nothing
      });
      musicRef.current = music;
    } else {
      musicRef.current.src = `/sounds/${track}`;
      musicRef.current.volume = volume;
      musicRef.current.play().catch(() => {
        // Do nothing
      });
    }
  };

  const stopMusic = () => {
    if (!musicRef.current) {
      return;
    }

    musicRef.current.pause();
    musicRef.current.volume = 0;
  };

  useEffect(() => {
    if (!show) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [show]);

  if (pathname !== "/" || !mounted) {
    return null;
  }

  const gotoRoom = (room) => {
    if (doorTimeout.current) {
      clearTimeout(doorTimeout.current);
    }

    flickerStatic(1000);

    playSoundEffect(`static.mp3`, 0.2);
    playSoundEffect(`door-${randomNumberBetween(1, 3)}-loud.mp3`);

    doorTimeout.current = setTimeout(() => {
      setCurrentRoom(room);
    }, 500);
  };

  const onCloseGame = () => {
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
  };

  const onOpenGame = () => {
    setCurrentRoom("room-1");
    playSoundEffect("open.mp3");
    setShow(true);

    setTimeout(() => {
      flickerStatic(1000);
    }, 500);
  };

  const onCloseItem = () => {
    const gameItem = document.getElementById("game-item");
    gameItem.classList.remove("slideUpFast");
    gameItem.classList.add("slideDownFast");
    playSoundEffect(`putdown-${randomNumberBetween(1, 2)}.wav`);

    setTimeout(() => {
      setSelectedItem(null);
    }, 600);
  };

  return (
    <>
      {show ? (
        <button
          className={`fixed top-0 right-0 p-4 cursor-pointer text-4xl hover:text-yellow-500 z-40 ${
            selectedItem ? "hidden" : ""
          }`}
          onClick={onCloseGame}
          disabled={selectedItem}
        >
          X
        </button>
      ) : (
        <button
          className="fixed bottom-0 right-0 p-4 cursor-pointer text-4xl hover:text-yellow-500 z-30"
          onClick={onOpenGame}
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
        className={`fixed top-[-25%] md:top-0 left-0 w-full h-full z-35 ${
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
              playSoundEffect("click-soft.mp3", 0.75);
            }}
          >
            {CLICK_AREAS[currentRoom].map((area) => {
              return (
                <button
                  key={area.id}
                  className="absolute  hover:bg-white/5 cursor-pointer z-5 pointer-events-auto"
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    width: `${area.width}%`,
                    height: `${area.height}%`,
                    top: `${area.top}%`,
                    left: `${area.left}%`,
                  }}
                  onClick={() => area.onClick()}
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
            width={1920}
            height={993}
            alt=""
            unoptimized
          />
        </div>
        <div className="block md:hidden fixed bottom-0 left-[50%] translate-y-[92%] translate-x-[-50%] z-49 brightness-120 pointer-events-none w-full h-full">
          <Image
            className="w-full h-full object-cover pointer-events-none select-none drop-shadow-lg"
            src={`/images/game/frame-mobile.png`}
            width={713}
            height={1251}
            alt=""
          />
        </div>
      </div>
      {selectedItem && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black/50 z-50">
          <div
            id="game-item"
            className="flex flex-col items-center translate-y-[-25%] md:translate-y-[0%] slideUpFast"
          >
            <div className="max-w-[50vw] md:max-w-[25vw]">
              <Image
                className="drop-shadow-2xl"
                src={`/images/game/${selectedItem}.png`}
                width={1249}
                height={1270}
                alt=""
              />
            </div>
            <div className="relative flex gap-2 p-6 w-[250px] md:w-[460px] md:py-12">
              <Image
                className="absolute top-0 left-0 w-full h-full object-fill"
                src={`/images/game/box.png`}
                width={1105}
                height={553}
                alt=""
              />
              {ITEMS[selectedItem]?.useText && (
                <button className="w-full text-2xl md:text-4xl leading-none text-white hover:text-yellow-300 text-center p-2 lowercase bg-black/75 z-1 cursor-pointer">
                  {ITEMS[selectedItem].useText}
                </button>
              )}
              <button
                className="w-full text-2xl md:text-4xl leading-none text-white hover:text-yellow-300 text-center p-2 lowercase bg-black/75 z-1 cursor-pointer"
                onClick={onCloseItem}
              >
                {ITEMS[selectedItem]?.cancelText || "Ok"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

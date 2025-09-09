"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { playSoundEffect, preloadImages, randomNumberBetween } from "@/utils";
import Static from "@/components/static";

const ITEMS = {
  "drain-cleaner": {
    useText: "Drink it",
    cancelText: "I'm not thirsty",
    usedText:
      "The caustic liquid burns away everything you were. Your last thought is regret. The room falls silent except for the drip of the faucet marking time you no longer have.",
  },
  hammer: {
    useText: "Smash",
    cancelText: "Heavy thoughts",
    usedText:
      "The weight of iron meets skull with a sickening crunch. Vision fractures into crimson fragments. The tool clatters to the floor, your final symphony echoing in the empty room.",
  },
  mushrooms: {
    useText: "Eat them",
    cancelText: "Nah",
    usedText:
      "The fungi's toxins creep through your veins like cold fingers. Your organs shut down one by one as you convulse on the floor. Nature's cruelest joke leaves you decomposing beside your last fatal meal.",
  },
  noose: {
    useText: "Try it on",
    cancelText: "Not today",
    usedText:
      "The rope tightens. The world narrows to a pinpoint of fading light. Your last sensation is the creaking of hemp against wood, a metronome counting your final moments.",
  },
  "pick-axe": {
    useText: "Get to work",
    cancelText: "Too lazy",
    usedText:
      "Steel punctures flesh with wet efficiency. You stare at the wooden handle protruding from your chest, comprehension dawning too late. Blood pools, reflecting your dimming eyes.",
  },
  "spike-bat": {
    useText: "Swing it",
    cancelText: "Leave it",
    usedText:
      "The spikes find their mark with brutal precision. You collapse, pinned by your own foolishness. The bat stands like a monument to poor decisions, painted with your blood.",
  },
  "producer-list": {
    cancelText: "What the fuck?",
  },
  "soulseek-saga-vinyl": {
    cancelText: "Nice",
  },
  ak47: {
    useText: "Check if it's loaded",
    cancelText: "Guns are dangerous",
    usedText:
      "The rifle's mechanism was more sensitive than expected. The deafening burst tears through you instantly. Shell casings rain down like metallic tears, the room painted in violence and regret",
  },
  "bolt-cutters": {
    useText: "Test the grip",
    cancelText: "These look serious",
    usedText:
      "The heavy jaws snap shut with industrial force, catching more than intended. Metal meets bone with disturbing ease. You crumple, watching the tool's handles form a V-shape mocking your final error.",
  },
  "broken-glass": {
    useText: "Examine closely",
    cancelText: "Seven years bad luck",
    usedText:
      "The shards glitter beautifully before painting themselves red. Your reflection fractures across a dozen crimson pieces. The floor becomes a mosaic of poor choices and spilled life.",
  },
  scorpion: {
    useText: "Pet him",
    cancelText: "Back away slowly",
    usedText:
      "The arachnid's tail whips forward. Neurotoxin floods your system, muscles seizing in waves of agony. You join the countless victims of nature's eight-legged executioner.",
  },
  "seppuku-saga-cassette": {
    useText: "Listen",
    cancelText: "Put it back",
    usedText:
      "The tape's warped audio guides you through ancient ritual. Your dedication to historical accuracy proves fatal. The cassette player continues its tinny narration to an audience no longer listening.",
  },
  shotgun: {
    useText: "Look down the barrel",
    cancelText: "Put it down",
    usedText:
      "The blast echoes through empty corridors. Smoke drifts from both barrels like departing souls. Your last sight is the ornate engravings on the stock—beautiful craftsmanship, terrible outcome.",
  },
  "broken-cd": {
    useText: "Handle the shards",
    cancelText: "Too sharp",
    usedText:
      "The disc fragments slice deep, each piece finding its own path through flesh. Rainbow reflections dance across spreading crimson. Your data has been permanently corrupted.",
  },
  "ancient-drink": {
    useText: "Take a sip",
    cancelText: "Smells off",
    usedText:
      "The ancient brew tastes of dust and bitter endings. Your insides revolt, then surrender. Whatever civilization created this poison, you've joined them in extinction.",
  },
  razorblade: {
    useText: "Test the edge",
    cancelText: "Too risky",
    usedText:
      "The blade whispers through skin like signing a contract in red ink. Gravity pulls crimson ribbons downward. The metal gleams, satisfied with its singular purpose fulfilled.",
  },
  "voodoo-doll": {
    useText: "Stick the pin",
    cancelText: "Bad juju",
    usedText:
      "The pin sinks into fabric, but the pain blooms in your chest. The doll grins with button eyes as you realize too late—it was already bound to you. Karma has a twisted sense of humor.",
  },
  screwdriver: {
    useText: "Pry with it",
    cancelText: "Wrong tool",
    usedText:
      "The Phillips head finds that soft spot between your ribs with. You twist involuntarily, driving it deeper. The handle juts out like a failed key to a lock you'll never open.",
  },
  "suicide-saga-cassette": {
    useText: "Press play",
    cancelText: "Rewind",
    usedText:
      "The tape hisses instructions you follow with hypnotic obedience. Side A ends with your ending. The auto-reverse clicks, but there's no one left to hear Side B.",
  },
  "rusty-nails": {
    useText: "Grab a handful",
    cancelText: "Tetanus risk",
    usedText:
      "The corroded metal punctures palm and purpose alike. Rust flakes mix with blood, creating abstract art from your poor judgment. Lockjaw sets in before regret fully forms.",
  },
  "causeway-chain": {
    cancelText: "Ok",
  },
};

export default function Game() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("room-1");
  const [selectedItem, setSelectedItem] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [highlightItems, setHighlightItems] = useState(false);
  const musicRef = useRef(null);
  const staticTimeout = useRef(null);
  const doorTimeout = useRef(null);
  const highlightItemsTimeout = useRef(null);
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
          playSoundEffect(`mystery.wav`, 0.5);
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
        id: "back-1",
        width: 20,
        height: 45,
        top: 0,
        left: 0,
        onClick: () => gotoRoom("room-1"),
      },
      {
        id: "back-2",
        width: 20,
        height: 25,
        top: 75,
        left: 0,
        onClick: () => gotoRoom("room-1"),
      },
      {
        id: "back-3",
        width: 12,
        height: 20,
        top: 80,
        left: 20,
        onClick: () => gotoRoom("room-1"),
      },
      {
        id: "laptop",
        width: 30,
        height: 50,
        top: 12,
        left: 40,
        onClick: () => {
          playSoundEffect("click-medium.mp3");
          startMusic("song-2-quiet.mp3");
        },
      },
      {
        id: "laptop-2",
        width: 35,
        height: 20,
        top: 54,
        left: 30,
        onClick: () => {
          playSoundEffect("click-medium.mp3");
          startMusic("song-2-quiet.mp3");
        },
      },
      {
        id: "ancient-drink",
        width: 8,
        height: 12,
        top: 70,
        left: 90,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("ancient-drink");
        },
      },
      {
        id: "suicide-saga-cassette",
        width: 9,
        height: 12,
        top: 82,
        left: 84,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("suicide-saga-cassette");
        },
      },
      {
        id: "voodoo-doll",
        width: 12,
        height: 12,
        top: 77,
        left: 57.5,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("voodoo-doll");
        },
      },
      {
        id: "broken-cd",
        width: 9,
        height: 10.5,
        top: 48.5,
        left: 0,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("broken-cd");
        },
      },
      {
        id: "razorblade",
        width: 5,
        height: 7,
        top: 59,
        left: 13,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("razorblade");
        },
      },
      {
        id: "rusty-nails-1",
        width: 9,
        height: 10.5,
        top: 62,
        left: 2,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("rusty-nails");
        },
      },
      {
        id: "rusty-nails-2",
        width: 6,
        height: 6,
        top: 89,
        left: 76.5,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("rusty-nails");
        },
      },
      {
        id: "screwdriver",
        width: 18,
        height: 11,
        top: 85,
        left: 35,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("screwdriver");
        },
      },
    ],
    "room-3": [
      {
        id: "back-room-1",
        width: 25,
        height: 100,
        top: 0,
        left: 85,
        onClick: () => gotoRoom("room-1"),
      },
      {
        id: "ak47",
        width: 8,
        height: 35,
        top: 61,
        left: 8,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 0.75);
          playSoundEffect("ak47-rack.mp3", 1);
          setSelectedItem("ak47");
        },
      },
      {
        id: "bolt-cutters",
        width: 11,
        height: 10,
        top: 85,
        left: 73.5,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("bolt-cutters");
        },
      },
      {
        id: "broken-glass",
        width: 11,
        height: 8,
        top: 89,
        left: 37,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("broken-glass");
        },
      },
      {
        id: "causeway-chain",
        width: 8,
        height: 8,
        top: 72,
        left: 46,
        onClick: () => {
          playSoundEffect("mystery.wav", 0.5);
          setSelectedItem("causeway-chain");
        },
      },
      {
        id: "shotgun",
        width: 16,
        height: 8,
        top: 8,
        left: 52,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 0.75);
          playSoundEffect("shotgun-cock.mp3", 1);
          setSelectedItem("shotgun");
        },
      },
      {
        id: "scorpion",
        width: 9,
        height: 8,
        top: 27,
        left: 39,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("scorpion");
        },
      },
      {
        id: "seppuku-saga-cassette",
        width: 4,
        height: 5,
        top: 69.5,
        left: 30,
        onClick: () => {
          playSoundEffect(`pickup-${randomNumberBetween(2, 3)}.mp3`, 1);
          setSelectedItem("seppuku-saga-cassette");
        },
      },
    ],
  };

  const preloadGameAssets = async () => {
    const assets = [
      "/images/game/room-1-lg.png",
      "/images/game/room-2-lg.png",
      "/images/game/room-3-lg.png",
      "/images/game/frame-mobile.png",
      "/images/game/frame-desktop.png",
    ];

    Object.keys(ITEMS).forEach((item) => {
      assets.push(`/images/game/${item}.png`);
    });

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

  const flashHighlightItems = () => {
    setHighlightItems(true);

    highlightItemsTimeout.current = setTimeout(() => {
      setHighlightItems(false);
    }, 1000);
  };

  useEffect(() => {
    if (!show || !mounted || selectedItem || !currentRoom) {
      return;
    }

    const interval = setInterval(async () => {
      flashHighlightItems();
    }, 16000);

    const timeout = setTimeout(() => flashHighlightItems(), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);

      if (highlightItemsTimeout.current) {
        clearTimeout(highlightItemsTimeout.current);
      }
    };
  }, [show, mounted, selectedItem, currentRoom]);

  useEffect(() => {
    preloadGameAssets().then(() => {
      setMounted(true);
    });
  }, []);

  const startMusic = (track = "song-1-quiet.mp3", volume = 1) => {
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

  const changeMusicVolume = (volume) => {
    if (!musicRef.current) {
      return;
    }

    musicRef.current.volume = volume;
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

    setSelectedItem(null);

    setTimeout(() => {
      setShow(false);
      setGameOver(false);
    }, 1000);
  };

  const onOpenGame = () => {
    setGameOver(false);
    setSelectedItem(null);
    setCurrentRoom("room-1");
    playSoundEffect("open.mp3");
    setShow(true);

    setTimeout(() => {
      flickerStatic(1000);
    }, 1000);
  };

  const onCloseItem = () => {
    const gameItem = document.getElementById("game-item");
    gameItem.classList.remove("slideUpFast");
    gameItem.classList.add("slideDownFast");
    playSoundEffect(`putdown-${randomNumberBetween(1, 2)}.wav`, 0.5);

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
            <Image
              className={`fixed w-full h-full object-fill select-none pointer-events-none ${
                highlightItems ? "opacity-100" : "opacity-10"
              } transition-all duration-300`}
              src={`/images/game/${currentRoom}-highlight.png`}
              width={3840}
              height={2160}
              alt=""
            />
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
                  onClick={() => area.onClick()}
                />
              );
            })}
          </div>
        </div>
        <div className="hidden md:block fixed top-0 left-0 w-full h-full z-50 pointer-events-none">
          <Image
            className="min-[1921px]:hidden w-full h-full object-fill md:object-contain lg:object-fill pointer-events-none select-none drop-shadow-lg"
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
        <div className="fixed bottom-[5%] md:bottom-[13%] left-0 flex items-center justify-center gap-8 h-[15vh] md:h-[12vh] w-full z-55 bg-black/50 md:bg-transparent">
          <button
            className={`group relative w-auto h-full cursor-pointer drop-shadow-[2px_2px_2px_black] ${
              currentRoom === "room-3" ? "opacity-50" : ""
            }`}
            onClick={() => {
              switch (currentRoom) {
                case "room-1":
                  playSoundEffect("click-hard.mp3", 0.5);
                  gotoRoom("room-3");
                  break;
                case "room-2":
                  playSoundEffect("click-hard.mp3", 0.5);
                  gotoRoom("room-1");
                  break;
                default:
                  playSoundEffect("click-hard.mp3", 0.75);
                  break;
              }
            }}
          >
            <Image
              className="w-full h-full object-contain drop-shadow-[2px_2px_2px_black]"
              src={`/images/game/left-arrow.png`}
              width={512}
              height={419}
              alt=""
            />
            <Image
              className="absolute top-0 left-0 w-full h-full object-contain z-1 opacity-0 group-hover:opacity-100 group-active:opacity-100 drop-shadow-[2px_2px_2px_black]"
              src={`/images/game/left-arrow-hover.png`}
              width={512}
              height={419}
              alt=""
            />
          </button>
          <button
            className={`group relative w-auto h-full cursor-pointer drop-shadow-[2px_2px_2px_black] ${
              currentRoom === "room-2" ? "opacity-50" : ""
            }`}
            onClick={() => {
              switch (currentRoom) {
                case "room-1":
                  playSoundEffect("click-hard.mp3", 0.5);
                  gotoRoom("room-2");
                  break;
                case "room-3":
                  playSoundEffect("click-hard.mp3", 0.5);
                  gotoRoom("room-1");
                  break;
                default:
                  playSoundEffect("click-hard.mp3", 0.75);
                  break;
              }
            }}
          >
            <Image
              className="w-full h-full object-contain drop-shadow-[2px_2px_2px_black]"
              src={`/images/game/right-arrow.png`}
              width={512}
              height={419}
              alt=""
            />
            <Image
              className="absolute top-0 left-0 w-full h-full object-contain z-1 opacity-0 group-hover:opacity-100 group-active:opacity-100 drop-shadow-[2px_2px_2px_black]"
              src={`/images/game/right-arrow-hover.png`}
              width={512}
              height={419}
              alt=""
            />
          </button>
        </div>
      </div>

      {selectedItem && (
        <div
          className={`fixed top-0 left-0 flex items-center justify-center w-full h-full ${
            gameOver ? "bg-red-900/25" : "bg-black/50"
          } z-50 transition-all duration-200`}
        >
          <div
            id="game-item"
            className="flex flex-col items-center justify-center slideUpFast"
          >
            {gameOver && (
              <div className="z-1 lowercase text-4xl md:text-5xl text-center w-full drop-shadow-[2px_2px_0px_black] text-yellow-300">
                You Killed Yourself!
              </div>
            )}
            <div className="max-w-[70vw] md:max-w-[50vw] lg:max-w-[25vw]">
              <Image
                className="drop-shadow-2xl"
                src={`/images/game/${selectedItem}.png`}
                width={1249}
                height={1270}
                alt=""
              />
            </div>
            <div className="relative flex gap-2 p-6 w-[80vw] md:w-[460px] 2xl:w-[600px] md:py-12">
              <Image
                className="absolute top-0 left-0 w-full h-full object-fill"
                src={`/images/game/box.png`}
                width={1105}
                height={553}
                alt=""
              />
              {gameOver ? (
                <div className="z-1 lowercase text-lg md:text-2xl p-4 text-justify font-light w-full drop-shadow-[2px_2px_0px_black] bg-black/50 leading-7 tracking-wider -mt-8">
                  {ITEMS[selectedItem].usedText}
                </div>
              ) : (
                <>
                  {ITEMS[selectedItem].useText && (
                    <button
                      className="w-full text-2xl md:text-4xl leading-none text-white hover:text-yellow-300 text-center p-2 lowercase bg-black/75 z-1 cursor-pointer"
                      onClick={() => {
                        changeMusicVolume(0.75);
                        playSoundEffect(`${selectedItem}.mp3`, 1);
                        setGameOver(true);
                      }}
                    >
                      {ITEMS[selectedItem].useText}
                    </button>
                  )}
                  <button
                    className="w-full text-2xl md:text-4xl leading-none text-white hover:text-yellow-300 text-center p-2 lowercase bg-black/75 z-1 cursor-pointer"
                    onClick={onCloseItem}
                  >
                    {ITEMS[selectedItem]?.cancelText || "Ok"}
                  </button>
                </>
              )}
            </div>
            {gameOver && (
              <button
                className="flex items-center justify-center text-5xl bg-red-900 w-full p-4 leading-none cursor-pointer fadeIn text-shadow-[2px_2px_0px_black]"
                style={{ animationDelay: "1s", animationDuration: "2s" }}
                onClick={onCloseGame}
              >
                Game Over
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { InertiaPlugin, Observer } from "gsap/all";
import { SLIDES } from "@/data";
import { CDN_URL, randomNumberBetween } from "@/utils";
import { Background } from "@/components/background";

gsap.registerPlugin(useGSAP, Observer, InertiaPlugin);

const NUMBER_OF_BACKGROUNDS = 4;

export default function Home() {
  const animating = useRef(false);
  const timeout = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentBackground, setCurrentBackground] = useState(0);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("noScroll");
    document.body.classList.add("noScroll");

    return () => {
      document.documentElement.classList.remove("noScroll");
      document.body.classList.remove("noScroll");
    };
  }, []);

  const changeSlide = useCallback((index) => {
    if (animating.current) {
      return;
    }

    animating.current = true;

    setCurrentSlide(index);
  }, []);

  const gotoNextSlide = useCallback(() => {
    if (animating.current) {
      return;
    }

    animating.current = true;

    setCurrentSlide((currentSlide) => {
      const nextSlide = currentSlide + 1;

      if (nextSlide > SLIDES.length - 1) {
        return 0;
      }

      return nextSlide;
    });
  }, []);

  const gotoPreviousSlide = useCallback(() => {
    if (animating.current) {
      return;
    }

    animating.current = true;

    setCurrentSlide((currentSlide) => {
      const previousSlide = currentSlide - 1;

      if (previousSlide < 0) {
        return SLIDES.length - 1;
      }

      return previousSlide;
    });
  }, []);

  useGSAP(() => {
    Observer.create({
      type: "wheel,touch,pointer",
      preventDefault: true,
      wheelSpeed: -1,
      onUp: () => {
        gotoNextSlide();
      },
      onDown: () => {
        gotoPreviousSlide();
      },
      tolerance: 5,
    });
  }, []);

  useGSAP(() => {
    // Position the current slide in the center
    const currentId = `#slide-${currentSlide}`;
    gsap.to(`${currentId} .bg`, {
      xPercent: -50,
      yPercent: -50,
      ease: "back.inOut",
      onComplete: () => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() => {
          animating.current = false;
        }, 200);
      },
    });
    gsap.to(`${currentId} .icon`, {
      xPercent: -50,
      yPercent: -40,
      scale: 1,
      ease: "back.out",
    });
    gsap.to(`${currentId} .name`, {
      xPercent: -50,
      yPercent: -50,
      ease: "sine.inOut",
    });
    gsap.to(`${currentId} .socials`, {
      yPercent: -50,
      xPercent: -50,
      ease: "elastic.inOut",
    });
    gsap.to(`${currentId} .bio`, {
      yPercent: 0,
      xPercent: -50,
      ease: "sine.inOut",
    });

    // Hide all the other slides
    for (let i = 0; i < SLIDES.length; i++) {
      if (i === currentSlide) {
        continue;
      }

      const id = `#slide-${i}`;
      gsap.to(`${id} .bg`, {
        xPercent: -300,
        ease: "back.inOut",
      });
      gsap.to(`${id} .icon`, { scale: 2, ease: "back.in" });
      gsap.to(`${id} .icon`, { yPercent: -300, ease: "back.in", delay: 0.5 });
      gsap.to(`${id} .icon`, { xPercent: 300, ease: "back.in" });
      gsap.to(`${id} .name`, {
        xPercent: -500,
        yPercent: -500,
        ease: "sine.inOut",
      });
      gsap.to(`${id} .socials`, {
        yPercent: -5000,
        ease: "sine.inOut",
      });
      gsap.to(`${id} .bio`, {
        yPercent: 0,
        xPercent: -500,
        ease: "sine.inOut",
      });
    }

    // Rotate barbed wires randomly
    gsap.to(`.wire-1`, {
      rotate: randomNumberBetween(1, 80),
      ease: "elastic",
    });
    gsap.to(`.wire-3`, {
      rotate: randomNumberBetween(-1, -80),
      ease: "elastic",
    });
    setCurrentBackground(randomNumberBetween(0, NUMBER_OF_BACKGROUNDS - 1));
  }, [currentSlide]);

  return (
    <>
      {/* <div className="fixed top-[8px] right-[8px] z-1 pointer-events-none">
        <Image
          className="h-[40px] md:h-[64px] lg:h-[96px] w-auto translate-x-[8px]"
          src={`${CDN_URL}/images/logos/logo-bandana.png`}
          alt=""
          width={169}
          height={272}
        />
        <Image
          className="h-[40px] md:h-[64px] lg:h-[96px] w-auto mt-2"
          src={`${CDN_URL}/images/logos/logo-modern.png`}
          alt=""
          width={169}
          height={272}
        />
      </div> */}
      <div
        className={`fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black z-35 pointer-events-none ${
          loaded >= SLIDES.length ? "fadeOut" : ""
        }`}
      >
        <Image
          className="md:hidden invert"
          src={`${CDN_URL}/images/logo-skull-small.gif`}
          width={255}
          height={277}
          alt="G59 Records"
          unoptimized
        />
        <Image
          className="hidden md:block invert"
          src={`${CDN_URL}/images/logo-skull.gif`}
          width={774}
          height={840}
          alt="G59 Records"
          unoptimized
        />
        <div className="lowercase text-yellow-100 mt-2">Loading...</div>
      </div>
      <div className="select-none">
        <Background currentBackground={currentBackground} />
        {SLIDES.map((slide, index) => {
          return (
            <Slide
              key={slide.name}
              index={index}
              slide={slide}
              onClick={() => {}}
              onOpenPhoto={() => {
                animating.current = true;
              }}
              onClosePhoto={() => {
                animating.current = false;
              }}
              onLoad={() => setLoaded((loaded) => loaded + 1)}
            />
          );
        })}
        <Selector currentSlide={currentSlide} changeSlide={changeSlide} />
        <div className="wire-1 fixed z-0 bottom-0 md:bottom-[-10%] w-[300vw] md:w-full drop-shadow-lg pointer-events-none">
          <Image
            src={`${CDN_URL}/images/wire-1.png`}
            width={3840}
            height={2160}
            alt=""
          />
        </div>
        <div className="wire-3 fixed z-[-1] bottom-[20%] md:bottom-0 w-[200vw] md:w-full drop-shadow-lg pointer-events-none">
          <Image
            src={`${CDN_URL}/images/wire-3.png`}
            width={3840}
            height={2160}
            alt=""
          />
        </div>
      </div>
    </>
  );
}

function Slide(props) {
  const wide = ["shakewell"].includes(props.slide.name);

  const customName = () => {
    return ["chetta", "shakewell"].includes(props.slide.name);
  };

  const customFont = () => {
    switch (props.slide.name) {
      case "night lovell":
        return "font-night uppercase";
      case "germ":
        return "font-germ uppercase";
      case "chetta":
        return "opacity-0";
      case "shakewell":
        return "opacity-0";
      case "duckboy":
        return "font-college uppercase tracking-tighter";
      case "lonely boy":
        return "font-aston capitalize";
      default:
        return "font-kraut lowercase";
    }
  };

  const textSize = () => {
    switch (props.slide.name) {
      case "chetta":
        return "max-[420px]:text-[6.4rem] text-[7rem] md:text-[12rem]";
      case "night lovell":
        return "text-[3.5rem] md:text-[5rem] xl:text-[7rem]";
      case "duckboy":
        return "text-[3.5rem] md:text-[5rem] xl:text-[7rem]";
      case "germ":
        return "text-[5rem] md:text-[9rem]";
      case "shakewell":
        return "max-[420px]:text-[5rem] text-[7rem] md:text-[12rem] 2xl:text-[15rem]";
      case "lonely boy":
        return "text-[3rem] md:text-[4rem] xl:text-[6rem] text-shadow-[0_0_2px_black]";
      default:
        return "text-[4rem] md:text-[7rem] lg:text-[7rem] xl:text-[8rem] 2xl:text-[9rem]";
    }
  };

  return (
    <div
      id={`slide-${props.index}`}
      className="select-none"
      onClick={props.onClick}
    >
      <div className="bg fixed top-[50%] left-[50%] w-[66vw] h-[66vh] brightness-60 select-none">
        <Image
          className="w-full h-full object-cover"
          src={props.slide.bg}
          alt=""
          width={3840}
          height={2160}
        />
      </div>
      <div
        className={`icon fixed top-[50%] left-[50%] md:top-[45%] md:left-[66%] ${
          wide ? "w-[100vw] md:w-[70vw]" : "w-[90vw] md:w-[66vw]"
        } h-[80vh] md:h-[66vh] drop-shadow-[0_4px_8px_rgb(0_0_0_/_0.75)] select-none z-5`}
      >
        <Image
          className="w-full h-full object-contain hover:scale-[1.05] transition-all duration-200 select-none drop-shadow-xl"
          src={props.slide.icon}
          alt=""
          width={2000}
          height={2000}
          onLoad={props.onLoad}
        />
      </div>
      <div className="group name fixed top-[25%] left-[50%] md:top-[50%] md:left-[35%] xl:top-[48%] drop-shadow-lg z-6">
        <h2
          className={`${customFont()} ${textSize()} text-white text-shadow-[0_0_8px_black] hover:scale-[1.1] transition-all duration-200 whitespace-nowrap`}
        >
          {props.slide.name}
        </h2>
        {customName() && (
          <Image
            className={`absolute top-0 md:top-[-15%] left-0 w-full h-full object-contain drop-shadow-[0_0_8px_black] ${
              props.slide.name === "shakewell" ? "translate-y-[-12px]" : ""
            } group-hover:scale-[1.1] transition-all duration-200`}
            src={`${CDN_URL}/images/artists/${props.slide.name}-logo.png`}
            width={1022}
            height={411}
            alt={props.slide.name}
          />
        )}
      </div>
      <div className="socials flex flex-col gap-5 md:gap-8 lg:gap-10 fixed top-[50%] left-[7%] md:top-[50%] md:left-[7.5%] z-10">
        <SocialMediaButton
          name="YouTube"
          href={props.slide.youtube}
          src={`${CDN_URL}/images/icons/youtube-icon.png`}
        />
        <SocialMediaButton
          name="Instagram"
          href={props.slide.ig}
          src={`${CDN_URL}/images/icons/ig-icon.png`}
        />
        <SocialMediaButton
          name="Spotify"
          href={props.slide.spotify}
          src={`${CDN_URL}/images/icons/spotify-icon.png`}
        />
        <SocialMediaButton
          name="SoundCloud"
          href={props.slide.soundcloud}
          src={`${CDN_URL}/images/icons/soundcloud-icon.png`}
        />
        {props.slide.x && (
          <SocialMediaButton
            name="X"
            href={props.slide.x}
            src={`${CDN_URL}/images/icons/x-icon.png`}
          />
        )}
        {props.slide.tiktok && (
          <SocialMediaButton
            name="TikTok"
            href={props.slide.tiktok}
            src={`${CDN_URL}/images/icons/tt-icon.png`}
          />
        )}
        {props.slide.web && (
          <SocialMediaButton
            name="Web"
            href={props.slide.web}
            src={`${CDN_URL}/images/icons/web-icon.png`}
          />
        )}
      </div>
      <div className="bio flex items-center justify-center text-center md:p-4 fixed top-[71%] md:top-[57.5%] left-[50%] w-full md:w-[32vw] md:left-[35%] h-[64px] z-10 drop-shadow-lg bg-black/33 md:bg-transparent">
        <div className="text-lg md:text-[2rem] text-shadow-[0_4px_4px_rgb(0_0_0_/_0.75)] whitespace-nowrap hover:scale-[1.1] transition-all duration-200">
          {props.slide.bio}
        </div>
      </div>
    </div>
  );
}

function SocialMediaButton(props) {
  return (
    <Link
      className="relative size-8 md:size-10 xl:size-12 cursor-pointer hover:scale-[1.1] transition-all duration-200"
      href={props.href}
      target="_blank"
    >
      <Image
        className="drop-shadow-[2px_2px_2px_#00000080]"
        src={props.src}
        alt={props.name}
        width={512}
        height={512}
      />
    </Link>
  );
}

function Selector(props) {
  return (
    <div className="selector flex flex-nowrap fixed top-[75%] md:top-[78%] left-[50%] translate-x-[-50%] w-full md:w-[64vw] h-[100px] z-5">
      <div className="absolute bg-[#e4e4e4] h-[48px] md:h-[72px] bottom-0 w-full" />
      {SLIDES.map((slide, index) => {
        const active = props.currentSlide === index;

        return (
          <button
            key={slide.name}
            className={`relative group cursor-pointer w-[100px] md:w-full drop-shadow-lg translate-y-[15%] md:translate-y-[0%] hover:scale-[1.2] active:scale-[1.1] transition-all duration-200 select-none ${
              active
                ? "scale-[1.15] md:scale-[1.25]"
                : "opacity-50 md:opacity-90"
            }`}
            onClick={() => {
              if (props.currentSlide === index) {
                return;
              }
              props.changeSlide(index);
            }}
          >
            <div className="absolute bg-black w-[66%] h-[66%] z-[-1] left-[50%] translate-x-[-50%] translate-y-[25%] md:translate-y-[40%]" />
            <Image
              className={`w-full h-full object-contain p-1 md:p-2 select-none drop-shadow-[2px_0px_0px_#e4e4e4] ${
                active ? "drop-shadow-[2px_2px_0px_white]" : ""
              }`}
              src={slide.icon}
              width={500}
              height={350}
              alt=""
            />
            <Image
              className={`absolute top-0 z-[-1] w-full h-full object-contain select-none transition-all duration-100 scale-[0.1] group-hover:scale-[1] ${
                active ? "scale-[1] -rotate-20" : ""
              }`}
              src={`${CDN_URL}/images/wires-hover.png`}
              width={1000}
              height={412}
              alt=""
            />
          </button>
        );
      })}
    </div>
  );
}

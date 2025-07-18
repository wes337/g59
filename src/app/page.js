"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { InertiaPlugin, Observer } from "gsap/all";
import { SLIDES } from "./data";
import { randomNumberBetween } from "./utils";

gsap.registerPlugin(useGSAP, Observer, InertiaPlugin);

export default function Home() {
  const animating = useRef(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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
      tolerance: 10,
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
        animating.current = false;
      },
    });
    gsap.to(`${currentId} .icon`, {
      xPercent: -50,
      yPercent: -40,
      ease: "back.out",
    });
    gsap.to(`${currentId} .name`, {
      xPercent: -50,
      yPercent: -50,
      ease: "sine.inOut",
    });
    gsap.to(`${currentId} .socials`, {
      yPercent: 0,
      xPercent: -50,
      ease: "sine.inOut",
    });
    gsap.to(`.wire-1`, {
      rotate: randomNumberBetween(1, 80),
      ease: "elastic",
    });
    gsap.to(`.wire-3`, {
      rotate: randomNumberBetween(-1, -80),
      ease: "elastic",
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
    }
  }, [currentSlide]);

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

  return (
    <div>
      <Image
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-25 object-cover object-bottom"
        src={`/images/backgrounds/bg-2.jpg`}
        alt=""
        width={3840}
        height={2160}
      />
      {SLIDES.map((slide, index) => {
        return (
          <Slide
            key={slide.name}
            index={index}
            slide={slide}
            onClick={gotoNextSlide}
          />
        );
      })}
      <div className="wire-1 fixed z-0 bottom-0 md:bottom-[-10%] w-[300vw] md:w-full drop-shadow-lg pointer-events-none">
        <Image src={`/images/wire-1.png`} width={3840} height={2160} alt="" />
      </div>
      <div className="wire-3 fixed z-[-1] bottom-[20%] md:bottom-0 w-[200vw] md:w-full drop-shadow-lg pointer-events-none">
        <Image src={`/images/wire-3.png`} width={3840} height={2160} alt="" />
      </div>
    </div>
  );
}

function Slide(props) {
  return (
    <div id={`slide-${props.index}`} onClick={props.onClick}>
      <div className="bg fixed top-[50%] left-[50%] w-[66vw] h-[66vh] brightness-75 select-none">
        <Image
          className="w-full h-full object-cover"
          src={props.slide.bg}
          alt=""
          width={3840}
          height={2160}
        />
      </div>
      <div className="icon fixed top-[52%] left-[50%] md:top-[50%] md:left-[66%] w-[80vw] h-[80vh] md:w-[66vw] md:h-[66vh] drop-shadow-[0_4px_8px_rgb(0_0_0_/_0.75)] select-none z-5">
        <Image
          className="w-full h-full object-contain hover:scale-[1.05] transition-all duration-200 select-none"
          src={props.slide.icon}
          alt=""
          width={2000}
          height={2000}
        />
      </div>
      <div className="name fixed top-[25%] left-[50%] md:top-[50%] md:left-[33%] xl:top-[48%] drop-shadow-lg z-3">
        <h2
          className={`text-[4rem] md:text-[7rem] lg:text-[8rem] text-shadow-[0_4px_8px_rgb(0_0_0_/_0.75)] hover:scale-[1.1] transition-all duration-200`}
        >
          {props.slide.name}
        </h2>
      </div>
      <div className="socials flex gap-4 md:gap-8 fixed top-[33%] left-[50%] md:top-[58%] md:left-[33%] z-10">
        <SocialMediaButton
          name="YouTube"
          href="https://www.youtube.com"
          src={`/images/icons/youtube-icon.png`}
        />
        <SocialMediaButton
          name="Instagram"
          href="https://www.instagram.com"
          src={`/images/icons/ig-icon.png`}
        />
        <SocialMediaButton
          name="Spotify"
          href="https://www.spotify.com"
          src={`/images/icons/spotify-icon.png`}
        />
        <SocialMediaButton
          name="SoundCloud"
          href="https://www.soundcloud.com"
          src={`/images/icons/soundcloud-icon.png`}
        />
      </div>
    </div>
  );
}

function SocialMediaButton(props) {
  return (
    <Link
      className="size-8 md:size-10 drop-shadow-lg cursor-pointer hover:scale-[1.1] transition-all duration-200"
      href={props.href}
    >
      <Image
        className="drop-shadow-lg"
        src={props.src}
        alt={props.name}
        width={512}
        height={512}
      />
    </Link>
  );
}

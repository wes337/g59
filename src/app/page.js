"use client";
import { useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { InertiaPlugin } from "gsap/all";
import { SLIDES } from "./data";

gsap.registerPlugin(useGSAP, InertiaPlugin);

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useGSAP(() => {
    for (let i = 0; i < SLIDES.length; i++) {
      const id = `#slide-${i}`;
      gsap.set(`${id} .bg`, {
        xPercent: -300,
      });
      gsap.set(`${id} .icon`, {
        yPercent: 300,
      });
      gsap.set(`${id} .icon`, { xPercent: 300 });
      gsap.set(`${id} .name`, {
        xPercent: -500,
        yPercent: -500,
      });

      gsap.set(`${id} .socials`, {
        yPercent: -5000,
      });
    }
  });

  useGSAP(() => {
    const currentId = `#slide-${currentSlide}`;
    gsap.to(`${currentId} .bg`, { xPercent: -50, ease: "back.inOut" });
    gsap.to(`${currentId} .icon`, {
      xPercent: -50,
      yPercent: 0,
      ease: "back.out",
    });
    gsap.to(`${currentId} .name`, {
      xPercent: 0,
      yPercent: -50,
      ease: "sine.inOut",
    });
    gsap.to(`${currentId} .socials`, {
      yPercent: 0,
      ease: "sine.inOut",
    });

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

  const gotoNextSlide = () => {
    setCurrentSlide((currentSlide) => {
      const nextSlide = currentSlide + 1;

      if (nextSlide > SLIDES.length - 1) {
        return 0;
      }

      return nextSlide;
    });
  };

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
    </div>
  );
}

function Slide(props) {
  return (
    <div id={`slide-${props.index}`} onClick={props.onClick}>
      <div className="bg fixed top-[50%] left-[50%] w-[66vw] h-[66vh] translate-[-50%] opacity-75 select-none">
        <Image
          className="w-full h-full object-cover"
          src={props.slide.bg}
          alt=""
          width={3840}
          height={2160}
        />
      </div>
      <div className="icon fixed top-[50%] left-[66%] w-[66vw] h-[66vh] translate-x-[-50%] translate-y-[-40%] drop-shadow-[0_4px_8px_rgb(0_0_0_/_0.75)] select-none">
        <Image
          className="w-full h-full object-contain"
          src={props.slide.icon}
          alt=""
          width={2000}
          height={2000}
        />
      </div>
      <div className="name fixed top-[50%] left-[33%] translate-x-[-33%] translate-y-[-50%] drop-shadow-lg invisible md:visible">
        <h2 className="text-[7rem] text-shadow-[0_4px_8px_rgb(0_0_0_/_0.75)]">
          {props.slide.name}
        </h2>
      </div>
      <div className="socials flex gap-8 fixed top-[64%] left-[33%] translate-x-[-33%] translate-y-[-40%]">
        <button className="size-10 drop-shadow-lg cursor-pointer hover:scale-[1.1]">
          <img src={`/images/icons/youtube-icon.png`} alt="YouTube" />
        </button>
        <button className="size-10 drop-shadow-lg cursor-pointer hover:scale-[1.1]">
          <img src={`/images/icons/ig-icon.png`} alt="Instagram" />
        </button>
        <button className="size-10 drop-shadow-lg cursor-pointer hover:scale-[1.1]">
          <img src={`/images/icons/spotify-icon.png`} alt="Spotify" />
        </button>
        <button className="size-10 drop-shadow-lg cursor-pointer hover:scale-[1.1]">
          <img src={`/images/icons/tt-icon.png`} alt="TikTok" />
        </button>
        <button className="size-10 drop-shadow-lg cursor-pointer hover:scale-[1.1]">
          <img src={`/images/icons/soundcloud-icon.png`} alt="Soundcloud" />
        </button>
      </div>
    </div>
  );
}

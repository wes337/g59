"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CDN_URL, isSmallScreen } from "@/utils";
import { TOURS } from "@/data";

gsap.registerPlugin(useGSAP);

function isDateInPast(date) {
  const inputDate = new Date(date);
  const now = new Date();
  return inputDate < now;
}

export default function TourMap() {
  const [hover, setHover] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("noScroll");
    document.body.classList.add("noScroll");

    return () => {
      document.documentElement.classList.remove("noScroll");
      document.body.classList.remove("noScroll");
    };
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      "#recap",
      { xPercent: 150, yPercent: -50, opacity: 0, ease: "elastic" },
      {
        xPercent: -50,
        yPercent: isSmallScreen() ? -40 : -50,
        opacity: 1,
        ease: "elastic",
        delay: 0.5,
      }
    );
  }, []);

  return (
    <>
      <div
        id="recap"
        className="fixed flex flex-col items-center justify-center top-[50%] left-[50%] opacity-0 w-full h-full z-15 pointer-events-none"
      >
        <div className="lowercase text-[2rem] leading-[2rem] md:text-[3rem] md:leading-[3rem] text-center text-shadow-[4px_4px_0_black] z-10">
          <div className="flex flex-col md:flex-row gap-2">
            <div>Greyday 2025...</div>
            <div>Turned America Grey</div>
          </div>
        </div>
        <iframe
          className="pointer-events-auto w-[75%] h-[33%] md:w-[33%] md:h-[33%] border-4 border-gray-300 shadow-[4px_4px_0_black] translate-y-[5%]"
          src="https://www.youtube.com/embed/kUn3WTuY-Ss"
          title=""
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="relative top-0 left-0 flex flex-col items-center h-auto w-full relative bg-black/50 min-[1921px]:translate-y-[25%]">
        <Image
          className="w-full h-full object-contain z-5 brightness-50 drop-shadow-[4px_4px_0_#ffffff10]"
          src={`${CDN_URL}/images/map.png`}
          width={1529}
          height={925}
          alt=""
        />
        <div className="absolute w-full h-full z-14 brightness-50">
          {TOURS.map((tour, index) => {
            const isOver = isDateInPast(tour.date);

            return (
              <button
                id={`tour-button-${index}`}
                key={tour.city}
                className={`group absolute z-10 hover:z-25 w-[5%] md:w-[3%] hover:scale-[1.15] transition-all duration-100 ${
                  isOver ? "brightness-85" : "cursor-pointer"
                } ${
                  hover && hover !== tour.city ? "opacity-75" : ""
                } bounceIn drop-shadow-[0_0_4px_white] hover:drop-shadow-[0_0_4px_#fde047]`}
                style={{
                  top: `${tour.top}%`,
                  left: `${tour.left}%`,
                  animationDelay: `${index * 0.03}s`,
                }}
                onClick={() => {
                  if (isOver) {
                    return;
                  }

                  const event = new CustomEvent("tourclick", {
                    detail: { tour },
                  });

                  document.dispatchEvent(event);
                }}
                onPointerEnter={() => setHover(tour.city)}
                onPointerLeave={() => setHover("")}
              >
                {isOver && (
                  <Image
                    className="invert absolute z-1 drop-shadow-[0_0_4px_black] group-hover:drop-shadow-[0_0_4px_#fde047]"
                    src={`${CDN_URL}/images/x.png`}
                    width={547}
                    height={662}
                    alt=""
                  />
                )}
                <Image
                  className="drop-shadow-[0_0_2px_black] group-hover:drop-shadow-[0_0_4px_#fde047]"
                  src={`${CDN_URL}/images/icons/skull-2.png`}
                  width={314}
                  height={412}
                  alt=""
                />
                <div className="z-2 opacity-0 group-hover:opacity-100 absolute top-[-100%] left-[50%] translate-x-[-50%] p-2 whitespace-nowrap bg-black font-sans font-bold text-sm text-yellow-300">
                  {tour.city}, {tour.state}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CDN_URL } from "@/utils";
import { TOURS } from "@/data";

gsap.registerPlugin(useGSAP);

function isDateInPast(date) {
  const inputDate = new Date(date);
  const now = new Date();
  return inputDate < now;
}

export default function TourMap() {
  const [hover, setHover] = useState("");

  return (
    <div className="flex items-center h-auto w-full relative bg-black/50">
      <Image
        className="w-full h-full object-contain z-5 brightness-50 drop-shadow-[4px_4px_0_#ffffff10]"
        src={`${CDN_URL}/images/map.png`}
        width={1529}
        height={925}
        alt=""
      />
      <div className="absolute w-full h-full">
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
  );
}

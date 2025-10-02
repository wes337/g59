"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CDN_URL, randomNumberBetween } from "@/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Tour({ tour, index }) {
  const attributes = tour.attributes;
  const [randomBackground, setRandomBackground] = useState(0);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const onTourClick = (event) => {
      const { tour } = event.detail;

      if (
        `${tour.city}, ${tour.state}`.toLowerCase() ===
        attributes["formatted-address"].toLowerCase()
      ) {
        const tourElement = document.getElementById(`tour-${index}`);
        tourElement.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "center",
        });
        setHighlight(true);
      } else {
        setHighlight(false);
      }
    };

    document.addEventListener("tourclick", onTourClick);

    return () => {
      document.removeEventListener("tourclick", onTourClick);
    };
  }, [tour, index]);

  useEffect(() => {
    setRandomBackground(randomNumberBetween(0, 4));
  }, []);

  useGSAP(() => {
    const id = `#tour-${index}`;
    const delay = index * 0.02;

    gsap.fromTo(
      `${id}`,
      { xPercent: -100, ease: "elastic" },
      { xPercent: 0, ease: "elastic", delay }
    );
  }, [index]);

  return (
    <div
      id={`tour-${index}`}
      className={`group font-sans flex flex-col md:flex-row relative p-2 z-15 scale-[0.75] mt-[-48px] md:scale-[1] md:mt-0 ${
        highlight ? "bg-white/25" : ""
      }`}
    >
      <Image
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1] opacity-0 group-hover:opacity-5"
        src={`${CDN_URL}/images/backgrounds/grunge-${randomBackground}.png`}
        width={1536}
        height={1024}
        alt=""
      />
      <div className="flex items-center justify-center text-center md:justify-start w-full">
        <div className="font-sans text-3xl md:text-4xl uppercase font-bold">
          {attributes["starts-at-short"]}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center text-center w-full whitespace-nowrap">
        <div className="font-sans uppercase text-3xl font-black">
          {attributes["formatted-address"]}
        </div>
        <div className="font-kraut lowercase text-xl md:text-2xl text-white/50">
          {attributes["venue-name"]}
        </div>
        <div className="font-kraut lowercase text-lg leading-none text-white/75 mt-1">
          {attributes["details"]}
        </div>
      </div>
      <div className="md:ml-auto flex items-center md:justify-end gap-3 w-full mt-4 md:mt-0">
        {attributes["promoted-on-sale-date-name"] && (
          <Link
            className="relative flex items-center justify-center font-stencil uppercase p-3 bg-gray-600/10 text-white w-full md:w-[100px] h-[40px] text-center text-2xl leading-none tracking-wider text-shadow-[0_4px_8px_rgb(0_0_0_/_0.75)]"
            href={`https://link.seated.com/${tour.id}/2`}
            target="_blank"
          >
            <span className="font-bold drop-shadow-sm">
              {attributes["promoted-on-sale-date-name"]}
            </span>
            <Image
              className="absolute z-[-1] top-0 left-0 w-full h-full opacity-25 drop-shadow-lg group-hover:opacity-50 transition-all duration-100"
              src={`${CDN_URL}/images/wires-hover.png`}
              alt=""
              width={1287}
              height={717}
            />
          </Link>
        )}
        <Link
          className="flex items-center justify-center font-kraut lowercase p-3 bg-gray-300/10 text-yellow-200 hover:text-yellow-300 w-full md:w-[100px] h-[40px] text-center text-2xl leading-none tracking-wider relative  text-shadow-[0_4px_8px_rgb(0_0_0_/_0.75)]"
          href={`https://link.seated.com/${tour.id}`}
          target="_blank"
        >
          Tickets
          <Image
            className="absolute z-[-1] top-0 left-0 w-full h-full opacity-25 drop-shadow-lg group-hover:opacity-50 transition-all duration-100"
            src={`${CDN_URL}/images/border-hover.png`}
            alt=""
            width={1287}
            height={717}
          />
        </Link>
      </div>
    </div>
  );
}

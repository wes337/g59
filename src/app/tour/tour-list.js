"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CDN_URL } from "@/utils";

gsap.registerPlugin(useGSAP);

function formatMonth(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
}

function formatDay(dateStr) {
  const date = new Date(dateStr);
  return date.getDate();
}


function TourRow({ tour, index }) {
  const attributes = tour.attributes;
  const startsAt = attributes["starts-at"];
  const isPast = new Date(startsAt) < new Date();

  return (
    <div
      id={`tour-row-${index}`}
      className={`tour-row group relative transition-colors duration-200 ${
        index % 2 === 1 ? "bg-white/[0.03]" : ""
      } ${
        isPast
          ? "opacity-30 pointer-events-none"
          : "hover:bg-white/[0.06]"
      }`}
    >
      {/* --- MOBILE layout (below md) --- */}
      <div className="flex flex-col p-5 gap-4 md:hidden">
        {/* top: date + location side by side */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center w-[72px] h-[72px] bg-white/[0.04] border border-white/[0.08] shrink-0">
            <span className="font-stencil text-xs tracking-[0.2em] text-yellow-300/80 leading-none">
              {formatMonth(startsAt)}
            </span>
            <span className="font-sans text-4xl font-black text-white leading-none mt-0.5">
              {formatDay(startsAt)}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="font-sans text-2xl font-bold uppercase tracking-tight truncate">
              {attributes["formatted-address"]}
            </div>
            <div className="font-kraut text-base text-white/40 lowercase truncate">
              {attributes["venue-name"]}
            </div>
          </div>
        </div>
        {/* bottom: buttons full width */}
        {!isPast && (
          <div className="flex items-center gap-2">
            {attributes["promoted-on-sale-date-name"] && (
              <Link
                className="flex items-center justify-center font-stencil uppercase px-4 h-[42px] text-base tracking-[0.15em] text-white bg-white/[0.06] border border-white/[0.08] flex-1"
                href={`https://link.seated.com/${tour.id}/2`}
                target="_blank"
              >
                {attributes["promoted-on-sale-date-name"]}
              </Link>
            )}
            <Link
              className="flex items-center justify-center font-stencil uppercase px-5 h-[42px] text-base tracking-[0.15em] text-yellow-300 border border-yellow-300/20 flex-1"
              href={`https://link.seated.com/${tour.id}`}
              target="_blank"
            >
              TICKETS
            </Link>
          </div>
        )}
        {isPast && (
          <span className="font-stencil uppercase text-xs tracking-[0.2em] text-white/20">
            PAST
          </span>
        )}
      </div>

      {/* --- DESKTOP layout (md and up) --- */}
      <div className="hidden md:flex items-center px-5 py-7">
        <div className="shrink-0">
          <div className="flex flex-col items-center justify-center w-[88px] h-[88px] bg-white/[0.04] border border-white/[0.08]">
            <span className="font-stencil text-sm tracking-[0.2em] text-yellow-300/80 leading-none">
              {formatMonth(startsAt)}
            </span>
            <span className="font-sans text-5xl font-black text-white leading-none mt-0.5">
              {formatDay(startsAt)}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center px-4 flex-1 min-w-0">
          <div className="font-sans text-3xl font-bold uppercase tracking-wide truncate">
            {attributes["formatted-address"]}
          </div>
          <div className="font-kraut text-lg text-white/40 lowercase truncate">
            {attributes["venue-name"]}
          </div>
        </div>
        {!isPast && (
          <div className="flex items-center gap-2 shrink-0">
            {attributes["promoted-on-sale-date-name"] && (
              <Link
                className="relative flex items-center justify-center font-stencil uppercase px-4 h-[42px] text-base tracking-[0.15em] text-white bg-white/[0.06] border border-white/[0.08] hover:border-yellow-300/30 hover:text-yellow-300 transition-all duration-200"
                href={`https://link.seated.com/${tour.id}/2`}
                target="_blank"
              >
                {attributes["promoted-on-sale-date-name"]}
              </Link>
            )}
            <Link
              className="relative flex items-center justify-center font-stencil uppercase px-5 h-[42px] text-base tracking-[0.15em] text-yellow-300 border border-yellow-300/20 hover:bg-yellow-300/[0.06] hover:border-yellow-300/40 transition-all duration-200"
              href={`https://link.seated.com/${tour.id}`}
              target="_blank"
            >
              TICKETS
              <Image
                className="absolute z-[-1] top-0 left-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity duration-200"
                src={`${CDN_URL}/images/border-hover.png`}
                alt=""
                width={1287}
                height={717}
              />
            </Link>
          </div>
        )}
        {isPast && (
          <div className="flex items-center shrink-0">
            <span className="font-stencil uppercase text-xs tracking-[0.2em] text-white/20">
              PAST
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TourList({ tours }) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".tour-row",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.035,
        }
      );
    },
    { scope: containerRef }
  );

  if (!tours || tours.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="font-kraut text-7xl md:text-9xl text-white/75 lowercase leading-none text-center">
          <div>check</div>
          <div>back</div>
          <div className="-mt-4 md:-mt-6">soon</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col">
      {/* rows */}
      {tours.map((tour, index) => (
        <TourRow key={tour.id} tour={tour} index={index} />
      ))}
    </div>
  );
}

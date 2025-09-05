"use client";

import Image from "next/image";
import { TOURS } from "./data";

function isDateInPast(date) {
  const inputDate = new Date(date);
  const now = new Date();
  return inputDate < now;
}

export default function TourMap(props) {
  return (
    <div className="flex items-center h-auto w-full relative bg-black/50">
      <Image
        className="w-full h-full object-contain z-5 opacity-50"
        src={`/images/map.png`}
        width={1529}
        height={925}
        alt=""
      />
      <div className="absolute w-full h-full">
        {TOURS.map((tour) => {
          const isOver = isDateInPast(tour.date);

          return (
            <button
              key={tour.city}
              className={`group cursor-pointer absolute z-10 hover:z-25 w-[3%] hover:scale-[1.1] transition-all duration-100 ${
                isOver ? "brightness-85" : ""
              }`}
              style={{
                top: `${tour.top}%`,
                left: `${tour.left}%`,
              }}
              onClick={() => {
                const event = new CustomEvent("tourclick", {
                  detail: { tour },
                });

                document.dispatchEvent(event);
              }}
            >
              {isOver && (
                <Image
                  className="invert absolute z-1 drop-shadow-[0_0_4px_black] group-hover:drop-shadow-[0_0_4px_#fde047]"
                  src={`/images/x.png`}
                  width={547}
                  height={662}
                  alt=""
                />
              )}
              <Image
                className="drop-shadow-[0_0_2px_white] group-hover:drop-shadow-[0_0_4px_#fde047]"
                src={`/images/icons/skull.png`}
                width={314}
                height={412}
                alt=""
              />
              <div className="z-2 opacity-0 group-hover:opacity-100 absolute top-[-100%] md:top-[-50%] left-[50%] translate-x-[-50%] p-2 whitespace-nowrap bg-black font-sans font-bold text-sm text-yellow-300">
                {tour.city}, {tour.state}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

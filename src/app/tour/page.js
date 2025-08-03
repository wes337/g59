import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { randomNumberBetween } from "@/utils";
import { Background } from "@/components/background";

async function getTours() {
  const response = await axios.get(
    "https://cdn.seated.com/api/tour/7a8dfbf3-1b50-4887-940c-7abec1d7406f?include=tour-events"
  );

  const tours = response.data?.included || [];

  tours.sort((a, b) => {
    return (
      new Date(a.attributes["starts-at"]).getTime() -
      new Date(b.attributes["starts-at"]).getTime()
    );
  });

  return tours;
}

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <>
      <div className="md:w-[95vw] md:max-w-[1100px] m-auto mt-[180px] flex flex-col gap-6 z-10 relative">
        <div className="absolute w-full h-full bg-black z-0" />
        {tours.map((tour) => {
          const attributes = tour.attributes;
          const randomBackground = randomNumberBetween(0, 4);

          return (
            <div
              key={tour.id}
              className="group font-sans flex flex-col md:flex-row relative p-2 z-15 scale-[0.75] mt-[-48px] md:scale-[1] md:mt-0"
            >
              <Image
                className="absolute top-0 left-0 w-full h-full object-cover z-[-1] opacity-0 group-hover:opacity-5"
                src={`/images/backgrounds/grunge-${randomBackground}.png`}
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
                      src={`/images/wires-hover.png`}
                      alt=""
                      width={1287}
                      height={717}
                    />
                  </Link>
                )}
                <Link
                  className="flex items-center justify-center font-kraut lowercase p-3 bg-gray-300/10 text-white w-full md:w-[100px] h-[40px] text-center text-2xl leading-none tracking-wider relative  text-shadow-[0_4px_8px_rgb(0_0_0_/_0.75)]"
                  href={`https://link.seated.com/${tour.id}`}
                  target="_blank"
                >
                  Tickets
                  <Image
                    className="absolute z-[-1] top-0 left-0 w-full h-full opacity-25 drop-shadow-lg group-hover:opacity-50 transition-all duration-100"
                    src={`/images/border-hover.png`}
                    alt=""
                    width={1287}
                    height={717}
                  />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <Background currentBackground={0} />
    </>
  );
}

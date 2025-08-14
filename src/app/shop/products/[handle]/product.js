"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatPriceInUSD, randomNumberBetween } from "@/utils";
import SizeChartIcon from "@/components/size-chart-icon";

export default function Product({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [randomGrunge, setRandomGrunge] = useState(0);

  useEffect(() => {
    setRandomGrunge(randomNumberBetween(0, 4));
  }, []);

  return (
    <div className="flex flex-col w-full md:flex-row gap-8 md:bg-black/75">
      <div className="relative w-full h-[50vh] md:w-[52.5vw] md:h-[70vh]">
        <Image
          className="absolute top-0 left-0 w-full scale-x-[1.2] translate-y-[-44px] pointer-events-none md:hidden"
          src={`/images/wires-line.png`}
          width={1000}
          height={273}
          alt=""
        />
        <Image
          className="absolute bottom-0 left-0 w-full scale-x-[-1.2] scale-y-[-1] translate-y-[44px] pointer-events-none md:hidden"
          src={`/images/wires-line.png`}
          width={1000}
          height={273}
          alt=""
        />
        <Image
          className="w-full h-full object-contain m-auto"
          src={product.images[currentImageIndex]}
          alt=""
          width={1500}
          height={1800}
        />
        <div className="absolute w-full h-full top-0 left-0 z-[-1] scale-x-[2] bg-black md:hidden">
          <Image
            className="w-full h-full opacity-25"
            src={`/images/backgrounds/grunge-${randomGrunge}.png`}
            alt=""
            width={1500}
            height={1800}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full z-1">
        <div className="lowercase text-2xl md:text-7xl text-yellow-300 text-shadow-[4px_4px_0px_black]">
          {product.title}
        </div>
        <div className="text-5xl text-shadow-[4px_4px_0px_black]">
          {formatPriceInUSD(product.price)}
        </div>
        <div className="relative p-4">
          <div
            className="font-sans"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
        <button className="cursor-pointer flex items-center font-sans gap-2 bg-white/10 w-max p-2 drop-shadow-[2px_2px_0px_black] hover:scale-[1.05]">
          <SizeChartIcon />
          <span className="uppercase font-bold">Size Chart</span>
        </button>
      </div>
    </div>
  );
}

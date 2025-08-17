"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { formatPriceInUSD, randomNumberBetween } from "@/utils";
import { MdClose } from "react-icons/md";
import SizeChartIcon from "@/components/size-chart-icon";

export default function Product({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [randomGrunge, setRandomGrunge] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    setRandomGrunge(randomNumberBetween(0, 4));
  }, []);

  const gotoNextImage = () => {
    setCurrentImageIndex((currentImageIndex) => {
      const nextImageIndex = currentImageIndex + 1;

      if (product.images[nextImageIndex] == null) {
        return 0;
      }

      return nextImageIndex;
    });
  };

  const gotoPreviousImage = () => {
    setCurrentImageIndex((currentImageIndex) => {
      const previousImageIndex = currentImageIndex - 1;

      if (previousImageIndex < 0) {
        return product.images.length - 1;
      }

      return previousImageIndex;
    });
  };

  return (
    <>
      <div className="flex flex-col w-full md:w-auto">
        <div className="flex flex-col w-full md:flex-row gap-8 md:bg-black/75">
          <div className="relative w-full h-[50vh] md:w-[52.5vw] md:h-[70vh] md:bg-white/10">
            {product.images.length > 1 && (
              <>
                <button
                  className="z-5 cursor-pointer absolute text-left top-0 left-0 w-[50%] h-full text-4xl tracking-[-2px] text-shadow-[4px_4px_0px_black] text-gray-300 hover:text-yellow-300 active:text-yellow-300"
                  onClick={gotoPreviousImage}
                >
                  &lt;&lt;
                </button>
                <button
                  className="z-5 cursor-pointer absolute text-right top-0 right-0 w-[50%] h-full text-4xl tracking-[-2px] text-shadow-[4px_4px_0px_black] text-gray-300 hover:text-yellow-300 active:text-yellow-300"
                  onClick={gotoNextImage}
                >
                  &gt;&gt;
                </button>
                <div className="z-2 absolute bottom-0 right-0 md:left-0 md:right-[auto] md:w-full md:text-center text-shadow-[2px_2px_0px_black] text-lg tracking-tighter select-none pointer-events-none text-yellow-100">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              </>
            )}
            <Image
              className="absolute top-0 left-0 w-full scale-x-[1.2] translate-y-[-48px] z-[-1] pointer-events-none md:hidden"
              src={`/images/wires-line.png`}
              width={1000}
              height={273}
              alt=""
            />
            <Image
              className="absolute bottom-0 left-0 w-full scale-x-[-1.2] scale-y-[-1] translate-y-[48px] z-[-1] pointer-events-none md:hidden"
              src={`/images/wires-line.png`}
              width={1000}
              height={273}
              alt=""
            />
            <Image
              className="w-full h-full object-contain m-auto opacity-0"
              src={product.images[0]}
              alt=""
              width={1500}
              height={1800}
            />
            {product.images.map((image, index) => {
              return (
                <Image
                  key={image}
                  className={`absolute top-0 left-0 w-full h-full object-contain m-auto z-1 ${
                    currentImageIndex === index ? "opacity-100" : "opacity-0"
                  } transition-all duration-200`}
                  src={image}
                  alt=""
                  width={1500}
                  height={1800}
                />
              );
            })}
            <div className="absolute w-full h-full top-0 left-0 z-[-1] scale-x-[2] bg-black md:scale-x-[1]">
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
            <div className="lowercase text-2xl md:text-5xl xl:text-7xl text-yellow-300 text-shadow-[4px_4px_0px_black]">
              {product.title}
            </div>
            <div className="text-5xl text-shadow-[4px_4px_0px_black]">
              {formatPriceInUSD(product.price)}
            </div>
            <div className="relative py-4">
              <div
                className="font-sans"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
            {product.sizeChart && (
              <button
                className="cursor-pointer flex items-center font-sans gap-2 bg-white/10 w-max p-2 drop-shadow-[2px_2px_0px_black] hover:scale-[1.05]"
                onClick={() => setShowSizeChart(true)}
              >
                <SizeChartIcon />
                <span className="uppercase font-bold">Size Chart</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {showSizeChart &&
        createPortal(
          <div className="fixed top-0 left-0 w-full h-full z-50 object-fill flex items-center justify-center bg-black/75">
            <button
              className="drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer fixed top-0 right-0 bg-black/75 p-4"
              onClick={() => setShowSizeChart(false)}
            >
              <MdClose size={48} />
            </button>
            <Image
              className="md:max-w-[90vw]"
              src={product.sizeChart}
              alt=""
              width={1836}
              height={995}
            />
          </div>,
          document?.body
        )}
    </>
  );
}

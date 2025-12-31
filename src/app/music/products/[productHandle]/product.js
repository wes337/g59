"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { CDN_URL, formatPriceInUSD, randomNumberBetween } from "@/utils";
import { MdClose, MdZoomIn, MdArrowBack } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import SizeChartIcon from "@/components/size-chart-icon";
import useGlobalState from "@/state";

export default function Product({ product }) {
  const { cartOpen } = useGlobalState(
    useShallow((state) => ({
      cartOpen: state.cartOpen,
    }))
  );
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [randomGrunge, setRandomGrunge] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showSizeError, setShowSizeError] = useState(false);

  const soldOut = !product.variants.some(
    ({ availableForSale }) => !!availableForSale
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    setRandomGrunge(randomNumberBetween(0, 4));
  }, []);

  useEffect(() => {
    if (showFullImage) {
      document.documentElement.classList.add("noScroll");
      document.body.classList.add("noScroll");
    } else {
      document.documentElement.classList.remove("noScroll");
      document.body.classList.remove("noScroll");
    }
  }, [showFullImage]);

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

  const onAddToCart = async () => {
    if (soldOut) {
      return;
    }

    if (!selectedVariant && product.variants.length > 1) {
      setShowSizeError(true);
      return;
    }

    const defaultVariant = product.variants[0].id;

    const event = new CustomEvent("addtocart", {
      detail: {
        merchandiseId: selectedVariant || defaultVariant,
        quantity,
      },
    });

    document.dispatchEvent(event);

    if (product.variants.length > 1) {
      setSelectedVariant(null);
    }

    setQuantity(1);
  };

  return (
    <>
      {createPortal(
        <button
          className={`fixed top-0 ${
            cartOpen ? "left-[-100%]" : "left-0"
          } m-2 text-white z-25 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer transition-all duration-250`}
          onClick={() => router.back()}
        >
          <MdArrowBack size={40} />
        </button>,
        document.body
      )}
      <div className="flex flex-col w-full md:w-auto">
        <div className="flex flex-col w-full md:flex-row gap-8 md:bg-black/75">
          <div className="relative w-full h-[50vh] md:w-[52.5vw] md:h-[70vh] md:bg-white/10">
            <button
              className="absolute cursor-pointer top-0 right-0 m-2 drop-shadow-[2px_2px_0px_black] bg-black/25 z-6 hover:text-yellow-300 hover:bg-black/50"
              onClick={() => setShowFullImage(true)}
            >
              <MdZoomIn size={40} />
            </button>
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
              src={`${CDN_URL}/images/wires-line.png`}
              width={1000}
              height={273}
              alt=""
            />
            <Image
              className="absolute bottom-0 left-0 w-full scale-x-[-1.2] scale-y-[-1] translate-y-[48px] z-[-1] pointer-events-none md:hidden"
              src={`${CDN_URL}/images/wires-line.png`}
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
                src={`${CDN_URL}/images/backgrounds/grunge-${randomGrunge}.png`}
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
            {soldOut && (
              <div className="lowercase tracking-wide text-4xl mt-4 text-center bg-white/10 w-full md:max-w-[512px] p-2 text-shadow-[4px_4px_0px_black]">
                Sold Out
              </div>
            )}
            {!soldOut && product.variants.length > 1 && (
              <div>
                <div className="lowercase text-md text-shadow-[2px_2px_0px_black] mb-1">
                  Select Size
                </div>
                <div className="flex gap-2 md:max-w-[512px]">
                  {product.variants.map((variant) => {
                    const soldOut = !variant.availableForSale;
                    const selected = selectedVariant === variant.id;

                    return (
                      <button
                        key={variant.id}
                        className={`font-bold border-1 border-transparent flex items-center justify-center text-center text-lg text-shadow-[2px_2px_0px_black] tracking-tighter leading-none font-sans p-2 w-full ${
                          selected
                            ? "bg-white/25 border-white/50"
                            : "bg-white/10"
                        } ${
                          soldOut ? "opacity-33" : "cursor-pointer"
                        } hover:scale-[1.1]`}
                        onClick={() => {
                          if (soldOut) {
                            return;
                          }

                          setSelectedVariant(variant.id);
                          setShowSizeError(false);
                        }}
                      >
                        {variant.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {!soldOut && (
              <div className="flex gap-2 w-full max-w-[512px]">
                <div className="flex items-center justify-center text-shadow-[2px_2px_0px_black] drop-shadow-[2px_2px_0px_black]">
                  <button
                    className="flex items-center justify-center w-[48px] md:w-[56px] h-full cursor-pointer bg-white/10 hover:text-yellow-200"
                    onClick={() =>
                      setQuantity((quantity) => Math.max(quantity - 1, 1))
                    }
                  >
                    <FaMinus size={18} />
                  </button>
                  <input
                    className="flex items-center justify-center text-center w-[64px] md:w-[80px] h-full text-2xl bg-white/5"
                    value={quantity}
                    onInput={(event) => {
                      const quantity = Number(event.target.value);

                      if (isNaN(quantity)) {
                        return;
                      }

                      setQuantity(Math.min(quantity, 30));
                    }}
                  />
                  <button
                    className="flex items-center justify-center w-[48px] md:w-[56px] h-full cursor-pointer bg-white/10 hover:text-yellow-200"
                    onClick={() =>
                      setQuantity((quantity) => Math.min(quantity + 1, 30))
                    }
                  >
                    <FaPlus size={18} />
                  </button>
                </div>
                <button
                  className="cursor-pointer w-full flex items-center font-sans text-lg md:text-3xl text-center justify-center gap-2 bg-white/10 p-2 md:p-4 drop-shadow-[2px_2px_0px_black] hover:scale-[1.05]"
                  onClick={onAddToCart}
                >
                  <span className="uppercase font-bold text-shadow-[2px_2px_0px_black]">
                    Add to Cart
                  </span>
                </button>
              </div>
            )}
            {showSizeError && (
              <div className="text-red-500 bg-red-500/10 p-1 md:p-0 text-center md:bg-transparent md:text-left font-bold font-sans text-lg">
                Please select a size!
              </div>
            )}
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
      {showFullImage &&
        createPortal(
          <div className="fixed top-0 left-0 w-full h-full z-50 overflow-y-auto bg-white">
            <button
              className="drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer fixed top-0 right-0 bg-black/75 p-4"
              onClick={() => setShowFullImage(false)}
            >
              <MdClose size={48} />
            </button>
            <Image
              className="w-full min-h-screen object-contain"
              src={product.images[currentImageIndex]}
              alt=""
              width={1500}
              height={1800}
            />
          </div>,
          document?.body
        )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { formatPriceInUSD, randomNumberBetween } from "@/utils";
import Link from "next/link";

gsap.registerPlugin(useGSAP);

export default function Product({ product, collection, index }) {
  const soldOut = !product.variants.some(
    ({ availableForSale }) => !!availableForSale
  );

  useGSAP(() => {
    const id = `#product-${index}`;
    const delay = index * 0.02;

    gsap.fromTo(
      `${id}`,
      { yPercent: 100, ease: "elastic" },
      { yPercent: 0, ease: "elastic", delay }
    );
  }, [index]);

  return (
    <div id={`product-${index}`}>
      <Link
        className="hidden sm:flex group overflow-hidden relative bg-gray-200"
        href={`/shop/${collection.handle}/products/${product.handle}`}
        prefetch
      >
        {soldOut && (
          <div className="absolute top-0 right-0 z-1 text-black lowercase m-2 text-lg tracking-wide bg-black/10 px-2 opacity-75 group-hover:opacity-100">
            Sold Out
          </div>
        )}
        <Image
          className="group-hover:scale-[1.1] group-hover:opacity-50 transition-all duration-200"
          src={product.images[0]}
          width={1500}
          height={1800}
          alt=""
        />
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-yellow-300 opacity-0 group-hover:opacity-100 lowercase text-center leading-5 text-md text-shadow-[1px_1px_2px_rgb(0_0_0_/_0.95)]">
          {product.title}
        </div>
        <div className="absolute bottom-0 left-0 w-full text-center z-10 text-black text-2xl tracking-wide opacity-0 group-hover:opacity-100">
          {formatPriceInUSD(product.price)}
        </div>
      </Link>
      <MobileProduct product={product} collection={collection} />
    </div>
  );
}

function MobileProduct({ product, collection }) {
  const [randomGrunge, setRandomGrunge] = useState(0);

  const soldOut = !product.variants.some(
    ({ availableForSale }) => !!availableForSale
  );

  useEffect(() => {
    setRandomGrunge(randomNumberBetween(0, 4));
  }, []);

  return (
    <Link
      className="group overflow-hidden bg-gray-200 sm:hidden"
      href={`/shop/${collection.handle}/products/${product.handle}`}
      prefetch
    >
      {soldOut && (
        <div className="absolute top-0 right-0 z-1 text-black lowercase m-2 text-lg tracking-wide bg-black/10 px-2 opacity-75 group-hover:opacity-100">
          Sold Out
        </div>
      )}
      <div className="relative">
        <Image src={product.images[0]} width={1500} height={1800} alt="" />
        <Image
          className="absolute top-0 left-0 h-full w-full scale-x-[1.05] scale-y-[1.05] mix-blend-overlay pointer-events-none z-[-1] opacity-50"
          src={`/images/backgrounds/grunge-${randomGrunge}.png`}
          width={1500}
          height={1800}
          alt=""
        />
      </div>
      <div className="text-yellow-300 lowercase text-lg leading-7 text-shadow-[2px_2px_0px_black] bg-black/10">
        {product.title}
      </div>
      <div className="text-white text-2xl tracking-wide mb-2 bg-black/10 text-shadow-[2px_2px_0px_black]">
        {formatPriceInUSD(product.price)}
      </div>
    </Link>
  );
}

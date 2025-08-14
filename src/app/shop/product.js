"use client";

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Product({ product, index }) {
  useGSAP(() => {
    const id = `#product-${index}`;
    const delay = index * 0.03;

    gsap.fromTo(
      `${id}`,
      { yPercent: 100, ease: "elastic" },
      { yPercent: 0, ease: "elastic", delay }
    );
  }, [index]);

  return (
    <div
      key={product.id}
      id={`product-${index}`}
      className="cursor-pointer group overflow-hidden relative bg-gray-200"
    >
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
    </div>
  );
}

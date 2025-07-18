"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export function Background() {
  const [currentBackground, setCurrentBackground] = useState(0);
  const [size, setSize] = useState("sm");

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth <= 640) {
        setSize("sm");
      } else if (window.innerWidth > 640 && window.innerWidth <= 768) {
        setSize("md");
      } else if (window.innerWidth > 768 && window.innerWidth <= 1080) {
        setSize("lg");
      } else if (window.innerWidth > 1080) {
        setSize("xl");
      }
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const className =
    "fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-25 object-cover object-bottom";

  return (
    <>
      <Image
        className={`${className} small`}
        src={`/images/backgrounds/bg-${currentBackground}-${size}.png`}
        alt=""
        width={1920}
        height={1080}
      />
    </>
  );
}

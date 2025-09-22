"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Background(props) {
  const pathname = usePathname();
  const [size, setSize] = useState("sm");

  useEffect(() => {
    if (pathname.match("shop")) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, [pathname]);

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

  const className = `fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-25 object-cover object-bottom ${
    pathname.match("shop") ? "invert" : ""
  }`;

  return (
    <>
      <Image
        className={`${className} small`}
        src={`/images/backgrounds/bg-${props.currentBackground}-${size}.png`}
        alt=""
        width={1920}
        height={1080}
      />
    </>
  );
}

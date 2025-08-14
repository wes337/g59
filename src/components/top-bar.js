"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export function TopBar() {
  const [scroll, setScroll] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = Math.floor(window.scrollY);
      setScroll(scrollY);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0 flex items-center justify-center w-full h-[148px] z-10 gap-8 transition-all duration-200 ${
          scroll >= 180 ? "top-[-25%]" : ""
        }`}
      >
        <NavLink label="Tour" href="/tour" />
        <div className="w-[80px] md:w-[148px] h-full" />
        <NavLink label="Shop" href="/shop" />
      </div>
      <div
        className={`fixed top-0 left-[50%] translate-x-[-50%] w-auto h-[148px] z-15 overflow-hidden transition-all duration-200 ${
          scroll >= 180 ? "scale-[0.8] top-[-5%]" : ""
        }`}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <div className="h-full w-full flex items-center justify-center hover:scale-[1.1] transition-all duration-200 drop-shadow-lg">
          <Link className="h-full w-auto" href="/">
            <Image
              className="w-full h-full object-contain"
              src={`/images/chain-base.png`}
              alt=""
              width={1000}
              height={1000}
            />
          </Link>
        </div>
      </div>
      <Image
        className={`fixed h-[64px] w-auto top-[70px] left-[50%] translate-x-[-50%] drop-shadow-lg spinner z-16 pointer-events-none transition-all duration-200 ${
          hover && scroll < 180 ? "scale-[1.1]" : ""
        } ${
          scroll >= 180
            ? "scale-[0.8] translate-y-[-70%] min-[1900px]:translate-y-[-82.5%] min-[2000px]:translate-y-[-70px]"
            : ""
        } ${hover && scroll >= 180 ? "scale-[0.85]" : ""}`}
        src={`/images/chain-skull.png`}
        alt=""
        width={547}
        height={662}
      />
    </>
  );
}

function NavLink(props) {
  const pathname = usePathname();

  return (
    <Link
      className={`group relative text-3xl md:text-4xl tracking-wide hover:scale-[1.1] transition-all duration-200 drop-shadow-lg hover:text-yellow-300 ${
        pathname === props.href ? "text-yellow-200" : ""
      }`}
      href={props.href}
    >
      <span className="z-1">{props.label}</span>
      <Image
        className={`absolute z-[-1] top-0 left-0 w-full h-full scale-y-[1.2] scale-x-[1.5] opacity-0 ${
          pathname === props.href ? "opacity-50" : ""
        } drop-shadow-lg group-hover:opacity-50 transition-all duration-100`}
        src={`/images/border-hover.png`}
        alt=""
        width={1287}
        height={717}
      />
    </Link>
  );
}

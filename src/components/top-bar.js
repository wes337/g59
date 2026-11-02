"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import useGlobalState from "@/state";
import { CDN_URL } from "@/utils";

const TOP_BAR_HEIGHT = 10;

export function TopBar() {
  const [scroll, setScroll] = useState(0);
  const { mobileMenuOpen, cartOpen } = useGlobalState(
    useShallow((state) => ({
      mobileMenuOpen: state.mobileMenuOpen,
      cartOpen: state.cartOpen,
    })),
  );

  useEffect(() => {
    const onScroll = () => {
      const scrollY = Math.floor(window.scrollY);
      setScroll(scrollY);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hide = cartOpen || mobileMenuOpen || scroll >= TOP_BAR_HEIGHT;

  return (
    <>
      <Nav hide={hide} />
      <Logo small={hide} />
    </>
  );
}

function Nav(props) {
  return (
    <div
      className={`fixed left-0 flex items-center justify-center w-full h-[56px] z-12 gap-8 transition-all duration-200 ${
        props.hide ? "top-[-25%]" : "top-[64px] md:top-[100px]"
      }`}
    >
      <NavLink label="Tour" href="/tour" />
      <NavLink label="Shop" href="/shop" />
      <NavLink label="Music" href="/music" />
    </div>
  );
}

function NavLink(props) {
  const pathname = usePathname();

  const textSize = () =>
    props.small ? "text-2xl md:text-3xl text-center" : "text-3xl md:text-4xl";

  return (
    <Link
      className={`group relative w-auto md:w-[96px] lg:w-[200px] xl:w-[320px] flex items-center justify-center ${textSize()} tracking-wide hover:scale-[1.1] transition-all duration-200 drop-shadow-lg hover:text-yellow-300 ${
        pathname.includes(props.href) ? "text-yellow-200" : ""
      } translate-y-[-12px] md:translate-y-[0]`}
      href={props.href}
      target={props.external ? "_blank" : undefined}
      prefetch
    >
      <span className="relative z-1">
        {props.label}
        {props.new && (
          <span className="text-[20px] sm:text-[24px] absolute top-[-33%] right-[-33%] rotate-15 lowercase text-red-500 text-shadow-lg">
            New!
          </span>
        )}
      </span>
      <Image
        className={`absolute z-[-1] top-0 left-0 w-full h-full scale-y-[1.2] scale-x-[1.5] opacity-0 ${
          pathname.includes(props.href) ? "opacity-50" : ""
        } drop-shadow-lg group-hover:opacity-50 transition-all duration-100 object-contain`}
        src={`${CDN_URL}/images/border-hover.png`}
        alt=""
        width={1287}
        height={717}
      />
    </Link>
  );
}

function Logo(props) {
  const pathname = usePathname();
  const [hover, setHover] = useState(false);
  const { cartOpen } = useGlobalState(
    useShallow((state) => ({
      cartOpen: state.cartOpen,
    })),
  );

  return (
    <>
      <div
        className={`fixed top-[-24px] md:top-[-45px] left-[50%] translate-x-[-50%] w-auto h-[80px] md:h-[148px] ${
          cartOpen ? "z-25" : "z-15"
        } overflow-hidden transition-all duration-200`}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <div className="h-full w-full flex items-center justify-center hover:scale-[1.1] transition-all duration-200 drop-shadow-lg">
          <Link
            className="h-full w-auto"
            href={
              pathname.includes("/shop") && pathname !== "/shop" ? "/shop" : "/"
            }
          >
            <Image
              className="w-full h-full object-contain"
              src={`${CDN_URL}/images/chain-base.png`}
              alt=""
              width={1000}
              height={1000}
            />
          </Link>
        </div>
      </div>
      <Image
        className={`fixed h-[32px] md:h-[64px] w-auto top-[15px] md:top-[25px] left-[50%] translate-x-[-50%] drop-shadow-lg spinner ${
          cartOpen ? "z-25" : "z-16"
        } pointer-events-none transition-all duration-200 ${
          hover ? "scale-[1.1]" : ""
        }`}
        src={`${CDN_URL}/images/chain-skull.png`}
        alt=""
        width={547}
        height={662}
      />
    </>
  );
}

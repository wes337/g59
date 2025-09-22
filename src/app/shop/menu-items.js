"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

gsap.registerPlugin(useGSAP);

export default function MenuItems({ menuItems }) {
  const pathname = usePathname();

  useGSAP(() => {
    menuItems.forEach((_, i) => {
      const id = `#menu-item-${i}`;
      const delay = i * 0.1;

      gsap.fromTo(
        `${id}`,
        { xPercent: -200, ease: "elastic" },
        { xPercent: 0, ease: "elastic", delay }
      );
    });
  }, [menuItems]);

  return (
    <div className="hidden md:flex flex-col text-right items-end bg-gray-300/50">
      {menuItems.map((menuItem, index) => {
        let active = pathname.includes(`/shop/${menuItem.resource.handle}`);

        if (pathname === "/shop" && menuItem.resource.handle === "all") {
          active = true;
        }

        return (
          <Link
            id={`menu-item-${index}`}
            key={menuItem.id}
            className={`flex items-center group relative lowercase text-xl [min-1920px]:text-2xl leading-8 cursor-pointer hover:text-yellow-300 h-[40px] w-full text-right drop-shadow-[2px_2px_0px_black]`}
            href={`/shop/${menuItem.resource.handle}`}
            prefetch
          >
            <div
              className={`w-max ml-auto group-hover:bg-white/10 group-hover:text-yellow-300 text-shadow-lg ${
                active ? "text-yellow-200" : "text-yellow-400"
              }`}
            >
              {menuItem.resource.title}
            </div>
            <Image
              className={`h-[24px] w-auto ml-2 ${
                active ? "opacity-100" : "opacity-0"
              } transition-all duration-200`}
              src={`/images/chain-skull.png`}
              width={547}
              height={662}
              alt=""
            />
          </Link>
        );
      })}
      <div className="h-[40px] w-[175px]">
        <Image
          className="h-full w-full object-cover"
          src={`/images/wires-line-2.png`}
          width={1000}
          height={153}
          alt=""
        />
      </div>
      <Link
        className={`flex items-center group relative lowercase text-xl [min-1920px]:text-2xl leading-8 cursor-pointer hover:text-yellow-300 h-[40px] w-full text-right drop-shadow-[2px_2px_0px_black] ${
          pathname.match("shop") ? "text-white" : ""
        }`}
        href={`/shop/look`}
        prefetch
      >
        <div
          className={`w-max ml-auto group-hover:bg-white/10 ${
            pathname === "/shop/look" ? "text-yellow-200" : ""
          }`}
        >
          Look Book
        </div>
        <Image
          className={`h-[24px] w-auto ml-2 ${
            pathname === "/shop/look" ? "opacity-100" : "opacity-0"
          } transition-all duration-200`}
          src={`/images/chain-skull.png`}
          width={547}
          height={662}
          alt=""
        />
      </Link>
      <Link
        className={`flex items-center group relative lowercase text-xl [min-1920px]:text-2xl leading-8 cursor-pointer hover:text-yellow-300 h-[40px] w-full text-right drop-shadow-[2px_2px_0px_black]  ${
          pathname.match("shop") ? "text-white" : ""
        }`}
        href={`https://www.g59recordsmerchandise.com/account`}
        prefetch
      >
        <div className={`w-max ml-auto group-hover:bg-white/10`}>
          My Account
        </div>
        <Image
          className={`h-[24px] w-auto ml-2 opacity-0`}
          src={`/images/chain-skull.png`}
          width={547}
          height={662}
          alt=""
        />
      </Link>
    </div>
  );
}

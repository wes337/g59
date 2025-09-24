"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MdMenu, MdClose, MdArrowBack } from "react-icons/md";
import { useShallow } from "zustand/react/shallow";
import useGlobalState from "@/state";

export default function MobileMenu({ menuItems }) {
  const { mobileMenuOpen, setMobileMenuOpen, cartOpen } = useGlobalState(
    useShallow((state) => ({
      mobileMenuOpen: state.mobileMenuOpen,
      setMobileMenuOpen: state.setMobileMenuOpen,
      cartOpen: state.cartOpen,
    }))
  );
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [back, setBack] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setBack(pathname.includes("/shop/") && pathname.includes("/products/"));
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.classList.add("noScroll");
      document.body.classList.add("noScroll");
    } else {
      document.documentElement.classList.remove("noScroll");
      document.body.classList.remove("noScroll");
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onResize = () => {
      setMobileMenuOpen(false);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex md:hidden">
      {back
        ? createPortal(
            <button
              className={`fixed top-0 ${
                cartOpen ? "left-[-100%]" : "left-0"
              } m-2 text-white z-25 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer transition-all duration-250`}
              onClick={() => router.back()}
            >
              <MdArrowBack size={40} />
            </button>,
            document.body
          )
        : createPortal(
            <button
              className={`block md:hidden fixed top-0 m-2 text-white z-25 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer ${
                mobileMenuOpen || cartOpen ? "left-[-100%]" : "left-0"
              } transition-all duration-250`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MdMenu size={40} />
            </button>,
            document.body
          )}
      {createPortal(
        <div
          className={`block md:hidden fixed top-0 w-full h-full z-12 bg-black sm:hidden ${
            mobileMenuOpen ? "left-0" : "left-[-200%]"
          } transition-all duration-200`}
        >
          <button
            className={`fixed top-0 m-2 text-white z-10 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer ${
              mobileMenuOpen ? "right-0" : "right-[-200%]"
            } transition-all duration-300`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <MdClose size={48} />
          </button>
          <div className="mt-[112px]">
            {menuItems.map((menuItem) => {
              let active = pathname.includes(
                `/shop/${menuItem.resource.handle}`
              );

              if (pathname === "/shop" && menuItem.resource.handle === "all") {
                active = true;
              }

              return (
                <Link
                  key={menuItem.id}
                  className={`group relative lowercase text-2xl leading-12 cursor-pointer hover:text-yellow-300 w-full text-center ${
                    active ? "text-yellow-300" : ""
                  }`}
                  href={`/shop/${menuItem.resource.handle}`}
                  onClick={() => setMobileMenuOpen(false)}
                  prefetch
                >
                  <div
                    className={`group-hover:bg-white/10 ${
                      active ? "bg-white/5" : ""
                    }`}
                  >
                    {menuItem.resource.title}
                  </div>
                </Link>
              );
            })}
            <div className="h-[40px] w-full mb-[-8px] mt-[-8px]">
              <Image
                className="h-full w-full object-cover"
                src={`/images/wires-line-2.png`}
                width={1000}
                height={153}
                alt=""
              />
            </div>
            <Link
              className={`group relative lowercase text-2xl leading-12 cursor-pointer hover:text-yellow-300 w-full text-center ${
                pathname === "/shop/look" ? "text-yellow-300" : ""
              }`}
              href={`/shop/look`}
              onClick={() => setMobileMenuOpen(false)}
              prefetch
            >
              <div
                className={`group-hover:bg-white/10 ${
                  pathname === "/shop/look" ? "bg-white/5" : ""
                }`}
              >
                Look Book
              </div>
            </Link>
            <Link
              className={`group relative lowercase text-2xl leading-12 cursor-pointer hover:text-yellow-300 w-full text-center`}
              href={`https://www.g59recordsmerchandise.com/account`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className={`group-hover:bg-white/10`}>My Account</div>
            </Link>
          </div>
          <div
            className={`fixed left-0 w-full text-center text-sm lowercase ${
              mobileMenuOpen ? "bottom-[32px]" : "bottom-[-100px]"
            } transition-all duration-200`}
          >
            <div className="flex gap-4 items-center justify-center m-auto text-center">
              <Link
                className="text-yellow-100 text-shadow-[2px_2px_0px_black] hover:text-yellow-300"
                href="/shop/policies/terms-of-service"
                onClick={() => setMobileMenuOpen(false)}
              >
                Terms
              </Link>
              <Link
                className="text-yellow-100 text-shadow-[2px_2px_0px_black] hover:text-yellow-300"
                href="/shop/policies/privacy-policy"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy
              </Link>
              <Link
                className="text-yellow-100 text-shadow-[2px_2px_0px_black] hover:text-yellow-300"
                href="/shop/policies/refund-policy"
                onClick={() => setMobileMenuOpen(false)}
              >
                Refunds
              </Link>
            </div>
            <div className="opacity-75">
              Copyright © 2025 G59 Records, Inc. All Rights Reserved
            </div>
          </div>
        </div>,
        document?.body
      )}
    </div>
  );
}

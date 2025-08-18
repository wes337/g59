"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { formatPriceInUSD } from "@/utils";
import Shopify from "@/shopify";
import Cache from "@/cache";
import { MdShoppingCart, MdClose, MdDelete } from "react-icons/md";

export default function Cart() {
  const pathname = usePathname();
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [open, setOpen] = useState(false);

  const totalItemsInCart = useMemo(() => {
    let total = 0;

    cartItems.forEach(({ quantity }) => {
      total += quantity;
    });

    return total;
  }, [cartItems]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("noScroll");
      document.body.classList.add("noScroll");
    } else {
      document.documentElement.classList.remove("noScroll");
      document.body.classList.remove("noScroll");
    }
  }, [open]);

  useEffect(() => {
    const initCart = async () => {
      const cachedCartId = await Cache.getItem("cartId");
      const validCart = cachedCartId
        ? await Shopify.isCartValid(cachedCartId)
        : false;

      if (validCart) {
        const existingCart = await Shopify.getCart(cachedCartId);
        setCart(existingCart);
      } else {
        const cart = await Shopify.createCart();
        Cache.setItem("cartId", cart.id, 3600);
        setCart(cart);
      }
    };

    initCart();
  }, []);

  useEffect(() => {
    const getCartItems = async () => {
      if (!cart) {
        return;
      }

      const cartItems = await Shopify.getCartItems(cart.id);
      setCartItems(cartItems);
    };

    getCartItems();

    document.addEventListener("updatecart", getCartItems);

    return () => {
      document.removeEventListener("updatecart", getCartItems);
    };
  }, [cart]);

  useEffect(() => {
    if (!cart) {
      return;
    }

    const onAddToCart = async (event) => {
      const merchandiseId = event.detail;
      const updatedCart = await Shopify.addToCart(cart.id, [
        { merchandiseId, quantity: 1 },
      ]);
      setCart(updatedCart);
      setOpen(true);
    };

    document.addEventListener("addtocart", onAddToCart);

    return () => {
      document.removeEventListener("addtocart", onAddToCart);
    };
  }, [cart]);

  if (!cart || cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <button
        className="fixed top-0 right-0 m-2 md:m-8 text-white z-10 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <MdShoppingCart className="p-1 md:p-0" size={40} />
        <div className="absolute bottom-[-4px] md:bottom-[-8px] left-0 mx-1 md:mx-0 text-lg md:text-2xl text-shadow-[2px_2px_0px_black] text-yellow-300">
          {totalItemsInCart}
        </div>
      </button>
      {createPortal(
        <>
          <div
            className={`fixed top-0 left-0 ${
              open
                ? "opacity-100 visible z-10"
                : "opacity-0 invisible pointer-events-none"
            } w-full h-full bg-black/75 hidden md:block transition-all duration-500`}
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            className={`hidden md:block absolute top-0 h-screen z-10 pointer-events-none ${
              open
                ? "left-[calc(33vw+64px)] opacity-100 rotate-92"
                : "left-[-200%] opacity-0 rotate-0"
            } transition-all duration-200`}
          >
            <Image
              className="h-full w-auto object-contain"
              src={`/images/wires-line.png`}
              width={1000}
              height={273}
              alt=""
            />
          </div>
          <div
            className={`fixed top-0 w-full h-full md:w-[33vw] z-11 bg-black ${
              open ? "right-0" : "right-[-200%]"
            } transition-all duration-200`}
          >
            <button
              className={`fixed top-0 m-2 text-white z-10 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer ${
                open ? "right-0" : "right-[-200%]"
              } transition-all duration-300`}
              onClick={() => setOpen(false)}
            >
              <MdClose size={48} />
            </button>
            <div className="mt-4 px-4 text-4xl text-yellow-200">Cart</div>
            <div className="mt-[172px] md:mt-0 p-4">
              {cartItems.map((cartItem) => (
                <CartItem key={cartItem.id} cartItem={cartItem} />
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function CartItem({ cartItem }) {
  return (
    <div className="flex gap-2 p-2 h-full bg-white/5">
      <div className="relative w-[100px] h-auto shadow-[2px_2px_0px_black]">
        <Image
          className="w-full h-full object-cover"
          src={cartItem.image}
          width={100}
          height={120}
          alt=""
        />
        <div className="absolute bottom-0 left-0 bg-black/50 w-[24px] text-center text-md tracking-wide text-shadow-[2px_2px_0px_black]">
          {cartItem.quantity}x
        </div>
      </div>
      <div className="relative flex flex-col bg-white/5 w-full p-2 text-shadow-[2px_2px_0px_black] shadow-[4px_4px_0px_black]">
        <div className="text-2xl tracking-wide">
          {formatPriceInUSD(cartItem.price)}
        </div>
        <div className="text-xl lowercase text-yellow-300">
          {cartItem.productTitle}
        </div>
        <div className="font-sans font-bold tracking-wide mt-1 uppercase opacity-75">
          Size: {cartItem.variantTitle}
        </div>
        <button className="absolute bottom-0 right-0 p-2 bg-black/50">
          <MdDelete />
        </button>
      </div>
    </div>
  );
}

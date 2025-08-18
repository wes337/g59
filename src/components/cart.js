"use client";

import { useState, useEffect, useMemo } from "react";
import Shopify from "@/shopify";
import Cache from "@/cache";
import { MdShoppingCart } from "react-icons/md";

export default function Cart() {
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

      if (cartItems.length > 0) {
        setOpen(true);
      }
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
    <button className="fixed top-0 right-0 m-2 md:m-8 text-white z-10 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer">
      <MdShoppingCart className="p-1 md:p-0" size={40} />
      <div className="absolute bottom-[-4px] md:bottom-[-8px] left-0 mx-1 md:mx-0 text-lg md:text-2xl text-shadow-[2px_2px_0px_black] text-yellow-300">
        {totalItemsInCart}
      </div>
    </button>
  );
}

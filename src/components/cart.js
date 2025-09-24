"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { formatPriceInUSD } from "@/utils";
import Shopify from "@/shopify";
import Cache from "@/cache";
import { MdShoppingCart, MdClose, MdDelete } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useShallow } from "zustand/react/shallow";
import useGlobalState from "@/state";

export default function Cart() {
  const pathname = usePathname();
  const { cartOpen, setCartOpen, mobileMenuOpen } = useGlobalState(
    useShallow((state) => ({
      cartOpen: state.cartOpen,
      setCartOpen: state.setCartOpen,
      mobileMenuOpen: state.mobileMenuOpen,
    }))
  );
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalItemsInCart = useMemo(() => {
    let total = 0;

    cartItems.forEach(({ quantity }) => {
      total += quantity;
    });

    return total;
  }, [cartItems]);

  useEffect(() => {
    setCartOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (cartOpen) {
      document.documentElement.classList.add("noScroll");
      document.body.classList.add("noScroll");
    } else {
      document.documentElement.classList.remove("noScroll");
      document.body.classList.remove("noScroll");
    }
  }, [cartOpen]);

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
      const { merchandiseId, quantity } = event.detail;
      const updatedCart = await Shopify.addToCart(cart.id, [
        { merchandiseId, quantity },
      ]);
      setCart(updatedCart);
      setCartOpen(true);
    };

    document.addEventListener("addtocart", onAddToCart);

    return () => {
      document.removeEventListener("addtocart", onAddToCart);
    };
  }, [cart]);

  if (!cart || cartItems.length === 0) {
    return null;
  }

  const onRemoveFromCart = async (cartItem) => {
    if (!cart || loading) {
      return;
    }

    setLoading(true);

    if (cartItem.quantity === 1) {
      await Shopify.removeFromCart(cart.id, [cartItem.id]);
    } else {
      await Shopify.updateQuantity(cart.id, cartItem.id, cartItem.quantity - 1);
    }

    const cartItems = await Shopify.getCartItems(cart.id);
    setCartItems(cartItems);

    setLoading(false);
  };

  const onChangeQuantity = async (cartItem, quantity) => {
    if (!cart || loading) {
      return;
    }

    setLoading(true);

    if (quantity > 30) {
      quantity = 30;
    }

    await Shopify.updateQuantity(cart.id, cartItem.id, Math.max(quantity, 1));
    const cartItems = await Shopify.getCartItems(cart.id);
    setCartItems(cartItems);

    setLoading(false);
  };

  const onClickCheckout = () => {
    if (!cart || loading) {
      return;
    }

    Cache.removeItem("cartId");

    window.location.href = cart.checkoutUrl;
  };

  return (
    <>
      <button
        className={`fixed top-0 ${
          mobileMenuOpen ? "right-[-100%]" : "right-0"
        } m-2 md:m-8 text-white z-20 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer transition-all duration-200`}
        onClick={() => setCartOpen(true)}
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
              cartOpen
                ? "opacity-100 visible z-20"
                : "opacity-0 invisible pointer-events-none"
            } w-full h-full bg-black/75 hidden md:block transition-all duration-500`}
            onClick={(event) => {
              event.stopPropagation();
              setCartOpen(false);
            }}
          />
          <div
            className={`hidden md:block fixed top-0 h-screen z-21 pointer-events-none ${
              cartOpen
                ? "left-[calc(33vw+48px)] opacity-100 rotate-92"
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
            className={`fixed top-0 w-full h-full md:w-[33vw] z-22 bg-black ${
              cartOpen ? "right-0" : "right-[-200%]"
            } transition-all duration-200`}
          >
            <button
              className={`fixed top-0 m-2 text-white z-10 drop-shadow-[2px_2px_0px_black] bg-black/50 cursor-pointer ${
                cartOpen ? "right-0" : "right-[-200%]"
              } transition-all duration-300`}
              onClick={() => setCartOpen(false)}
            >
              <MdClose size={48} />
            </button>
            <div className="relative mt-4 px-4 text-4xl text-yellow-200">
              Cart
              <Image
                className={`absolute z-[-1] top-0 left-0 w-[100px] h-full opacity-50 drop-shadow-lg`}
                src={`/images/border-hover.png`}
                alt=""
                width={1287}
                height={717}
              />
            </div>
            <div className="mt-[64px] md:mt-0 p-4">
              {cartItems.map((cartItem) => (
                <CartItem
                  key={cartItem.id}
                  cartItem={cartItem}
                  onRemoveFromCart={() => onRemoveFromCart(cartItem)}
                  onChangeQuantity={(quantity) =>
                    onChangeQuantity(cartItem, quantity)
                  }
                />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 w-full flex flex-col mt-auto bg-white/5">
              <div className="flex items-center gap-2 w-full p-4 text-white text-shadow-[2px_2px_0px_black]">
                <div className="lowercase text-xl">Total</div>
                <div className="font-sans ml-auto text-xl md:text-3xl font-bold">
                  {formatPriceInUSD(cart.estimatedCost.totalAmount.amount)}{" "}
                  {cart.estimatedCost.totalAmount.currencyCode}
                </div>
              </div>
              <div className="lowercase text-yellow-100 mx-4 pt-4 mb-4 text-md text-center md:text-xl text-shadow-[2px_2px_0px_black] border-t-1 border-white/25">
                Tax included and shipping calculated at checkout
              </div>
              <div>
                <button
                  className="cursor-pointer w-full flex items-center font-sans text-3xl text-center justify-center gap-2 bg-white/10 p-8 drop-shadow-[2px_2px_0px_black] hover:scale-[1.05]"
                  onClick={onClickCheckout}
                >
                  <span className="uppercase font-bold text-yellow-300 text-shadow-[2px_2px_0px_black]">
                    Checkout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function CartItem({ cartItem, onRemoveFromCart, onChangeQuantity }) {
  return (
    <div className="flex gap-2 p-2 h-full max-h-[140px] md:max-h-[156px] bg-white/5">
      <div className="relative w-[100px] h-auto shadow-[2px_2px_0px_black] bg-white/90">
        <Image
          className="w-full h-full object-contain"
          src={cartItem.image}
          width={100}
          height={120}
          alt=""
        />
      </div>
      <div className="relative flex flex-col bg-white/5 w-full p-1 md:p-2 text-shadow-[2px_2px_0px_black] shadow-[4px_4px_0px_black]">
        <div className="text-xl md:text-2xl tracking-wide">
          {formatPriceInUSD(cartItem.price)}
        </div>
        <div className="text-lg md:text-xl lowercase text-yellow-200 truncate">
          {cartItem.productTitle}
        </div>
        <div className="font-sans font-bold tracking-wide mt-1 text-sm md:text-md uppercase opacity-75">
          Size: {cartItem.variantTitle}
        </div>
        <div className="flex mt-2">
          <div className="flex items-center justify-center text-center h-full w-max">
            <button
              className="flex items-center justify-center text-center w-[32px] h-full cursor-pointer bg-black/50 hover:bg-white/5"
              onClick={() => onChangeQuantity(cartItem.quantity - 1)}
              disabled={cartItem.quantity === 1}
            >
              <FaMinus size={12} />
            </button>
            <div className="flex items-center justify-center w-[40px] h-full text-center bg-black/50">
              {cartItem.quantity}
            </div>
            <button
              className="flex items-center justify-center text-center w-[32px] h-full cursor-pointer bg-black/50 hover:bg-white/5"
              onClick={() => onChangeQuantity(cartItem.quantity + 1)}
              disabled={cartItem.quantity >= 30}
            >
              <FaPlus size={12} />
            </button>
          </div>
          <button
            className="cursor-pointer ml-auto p-2 bg-black/50 hover:bg-white/5"
            onClick={onRemoveFromCart}
          >
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  );
}

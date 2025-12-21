import { GoogleTagManager } from "@next/third-parties/google";
import { Background } from "@/components/background";
import Wire from "@/components/wire";
import Cart from "@/components/cart";

export default function ShopLayout({ children }) {
  return (
    <>
      <div className="flex mt-[120px] md:mt-[208px] m-auto w-[90vw] sm:w-[66vw] max-w-[900px] md:max-w-[1200px] xl:w-[75vw] xl:max-w-[1200px] relative z-10">
        {children}
      </div>
      <Wire wire={1} />
      <Wire wire={2} />
      <Wire wire={3} />
      <Background currentBackground={3} />
      <Cart music />
      <GoogleTagManager gtmId="GTM-T3VJM4JP" />
    </>
  );
}

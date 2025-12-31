import Shopify from "@/shopify";
import Product from "./product";
import { CDN_URL } from "@/utils";

export default async function Products() {
  const products = await Shopify.getProducts(100, null, "TITLE", true, true);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.results.map((product, index) => {
          return <Product key={product.id} product={product} index={index} />;
        })}
      </div>
      <div
        className={`hidden sm:flex absolute w-full h-full z-[-1] scale-[1.025] pointer-events-none bg-white opacity-50 bg-[url(${CDN_URL}/images/backgrounds/grunge-2.png)] bg-center bg-repeat`}
      />
    </>
  );
}

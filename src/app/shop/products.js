import Shopify from "@/shopify";
import Product from "./product";

export default async function Products({ handle }) {
  const { products, collection } = await Shopify.getCollectionProductsByHandle(
    handle
  );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-2">
        {products.results.map((product, index) => {
          return (
            <Product
              key={product.id}
              product={product}
              index={index}
              collection={collection}
            />
          );
        })}
      </div>
      <div className="hidden sm:flex absolute w-full h-full z-[-1] scale-[1.025] pointer-events-none bg-white opacity-50 bg-[url(/images/backgrounds/grunge-2.png)] bg-center bg-repeat" />
    </>
  );
}

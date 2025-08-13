import Shopify from "@/shopify";
import Image from "next/image";

export default async function Products() {
  const { products } = await Shopify.getCollectionProducts(
    "gid://shopify/Collection/634818330991"
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 xl:grid-cols-6 gap-2">
      {products.results.map((product) => {
        return (
          <div
            key={product.id}
            className="cursor-pointer group overflow-hidden relative bg-gray-200"
          >
            <Image
              className="group-hover:scale-[1.1] group-hover:opacity-50 transition-all duration-200"
              src={product.images[0]}
              width={1500}
              height={1800}
              alt=""
            />
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-yellow-300 opacity-0 group-hover:opacity-100 lowercase text-center leading-5 text-md text-shadow-[1px_1px_2px_rgb(0_0_0_/_0.95)]">
              {product.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}

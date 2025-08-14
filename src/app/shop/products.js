import Shopify from "@/shopify";
import Product from "./product";

export default async function Products({ handle }) {
  const { products } = await Shopify.getCollectionProductsByHandle(handle);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 xl:grid-cols-6 gap-2">
      {products.results.map((product, index) => {
        return <Product key={product.id} product={product} index={index} />;
      })}
    </div>
  );
}

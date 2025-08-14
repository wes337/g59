import Shopify from "@/shopify";
import Product from "./product";

export default async function Page({ params }) {
  const { productHandle, collectionHandle } = await params;
  const product = await Shopify.getProduct(productHandle);

  if (!product) {
    return <div>Not found...</div>;
  }

  return <Product product={product} collectionHandle={collectionHandle} />;
}

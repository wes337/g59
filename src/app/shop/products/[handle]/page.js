import Shopify from "@/shopify";
import Product from "./product";

export default async function Page({ params }) {
  const { handle } = await params;
  const product = await Shopify.getProduct(handle);

  if (!product) {
    return <div>Not found...</div>;
  }

  return <Product product={product} />;
}

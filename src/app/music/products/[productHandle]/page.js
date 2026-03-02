import Shopify from "@/shopify";
import Product from "./product";

export const revalidate = 60;

export default async function Page({ params }) {
  const { productHandle } = await params;
  const product = await Shopify.getProduct(productHandle, true);

  if (!product) {
    return <div>Not found...</div>;
  }

  return <Product product={product} />;
}

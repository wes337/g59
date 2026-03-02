import Script from "next/script";
import Products from "./products";

export const revalidate = 60;

export default async function ShopPage() {
  return (
    <>
      <Products handle="all" />
      <Script src="https://static.klaviyo.com/onsite/js/Tvwean/klaviyo.js" />
    </>
  );
}

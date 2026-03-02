import Script from "next/script";
import Products from "../products";

export const revalidate = 60;

export default async function Page({ params }) {
  const { collectionHandle } = await params;

  return (
    <>
      <Products handle={collectionHandle} />
      <Script src="https://static.klaviyo.com/onsite/js/Tvwean/klaviyo.js" />
    </>
  );
}

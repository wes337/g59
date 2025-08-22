import Script from "next/script";
import Products from "../products";

// export const revalidate = 0;
// export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { collectionHandle } = await params;

  return (
    <>
      <Products handle={collectionHandle} />
      <Script src="https://static.klaviyo.com/onsite/js/Tvwean/klaviyo.js" />
    </>
  );
}

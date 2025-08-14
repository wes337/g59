import Products from "../products";

// export const revalidate = 0;
// export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { handle } = await params;

  return <Products handle={handle} />;
}

import Products from "./products";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function MusicPage() {
  return (
    <>
      <Products />
    </>
  );
}

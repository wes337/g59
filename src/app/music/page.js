import Products from "./products";

export const revalidate = 60;

export default async function MusicPage() {
  return <Products />;
}

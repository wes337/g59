import Shopify from "@/shopify";
import LookBook from "./lookbook";

export const revalidate = 120;

export default async function LookPage() {
  const { results: pages } = await Shopify.getPages();
  const page = pages.find(({ handle }) => handle === "preview");

  return (
    <div className="bg-black/75 p-2 md:p-4 w-full mt-[-24px]">
      <h1 className="hidden md:block text-center text-3xl text-yellow-300 mb-4 text-shadow-lg">
        Look Book
      </h1>
      <div className="flex items-center justify-center m-auto w-full">
        <LookBook html={page.body} />
      </div>
    </div>
  );
}

import Shopify from "@/shopify";
import Image from "next/image";

async function getMenuItems() {
  const menu = await Shopify.getMenu();

  return (
    menu.items.find(({ id }) => id === "gid://shopify/MenuItem/728439456111")
      ?.items || []
  );
}

export default async function Menu() {
  const menuItems = await getMenuItems();

  return (
    <div className="hidden sm:flex flex-col text-right items-end">
      {menuItems.map((menuItem) => {
        return (
          <button
            key={menuItem.id}
            className="group relative lowercase text-xl leading-8 cursor-pointer hover:text-yellow-300 w-full text-right"
          >
            <div className="w-max ml-auto group-hover:bg-white/10">
              {menuItem.resource.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}

import Shopify from "@/shopify";
import MobileMenu from "./mobile-menu";
import MenuItems from "./menu-items";

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
    <>
      <MenuItems menuItems={menuItems} />
      <MobileMenu menuItems={menuItems} />
    </>
  );
}

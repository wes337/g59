import { create } from "zustand";

const useGlobalState = create((set) => ({
  cartOpen: false,
  setCartOpen: (cartOpen) => set(() => ({ cartOpen })),
  mobileMenuOpen: false,
  setMobileMenuOpen: (mobileMenuOpen) => set(() => ({ mobileMenuOpen })),
}));

export default useGlobalState;

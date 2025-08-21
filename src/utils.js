export const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPriceInUSD(amount) {
  return currencyFormatter.format(amount);
}

export function toCamelCase(text) {
  return text.replace(/-([a-z])/g, (t) => {
    return t[1].toUpperCase();
  });
}

export function isSmallScreen() {
  try {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );

    const breakpoint = 40 * rootFontSize;

    return window.innerWidth < breakpoint;
  } catch {
    return false;
  }
}

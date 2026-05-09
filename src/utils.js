export const CDN_URL = "https://w-img.b-cdn.net/g59";

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
      getComputedStyle(document.documentElement).fontSize,
    );

    const breakpoint = 40 * rootFontSize;

    return window.innerWidth < breakpoint;
  } catch {
    return false;
  }
}

export function isValidEmail(email) {
  const emailRegex = new RegExp(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, "g");
  return emailRegex.test(email.toLowerCase());
}

export function preloadImages(urls) {
  const promises = urls.map((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = url;
    });
  });

  return Promise.all(promises);
}

export const playSoundEffect = (soundEffect, volume) => {
  return new Promise((resolve) => {
    try {
      const url = `${CDN_URL}/sounds/${soundEffect}`;
      const audio = new Audio(url);
      audio.volume = volume || 0.75;

      audio.onended = () => {
        audio.remove();
        resolve();
      };

      const playPromise = audio.play().catch(() => {
        // Do nothing
        resolve();
      });

      if (playPromise !== undefined) {
        audio.play().catch(() => {
          // Do nothing
          resolve();
        });
      }
    } catch {
      // Do nothing
      resolve();
    }
  });
};

export function formatProductTitle(title) {
  try {
    return title.toLowerCase().replace(/g59/gi, "G59");
  } catch {
    return title;
  }
}

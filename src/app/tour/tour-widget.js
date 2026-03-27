"use client";

import { useEffect } from "react";

export default function TourWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.seated.com/app.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="py-8">
      <div
        id="seated-55fdf2c0"
        data-artist-id="7a8dfbf3-1b50-4887-940c-7abec1d7406f"
        data-css-version="3"
      />
    </div>
  );
}

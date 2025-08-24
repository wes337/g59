"use client";

import { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function LookBook({ html }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(html, "text/html");
    const images = parsedDocument.body.querySelectorAll("img");
    setImages(Array.from(images).map((image) => image.src));
  }, [html]);

  return (
    <ImageGallery
      items={images.map((image) => ({
        original: image,
      }))}
      slideDuration={800}
      autoPlay
    />
  );
}

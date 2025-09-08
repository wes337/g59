"use client";

import { useState, useEffect } from "react";
import { randomNumberBetween } from "@/utils";

export default function Static() {
  const [opacity, setOpacity] = useState("opacity-90");

  useEffect(() => {
    const interval = setInterval(() => {
      const random = randomNumberBetween(1, 3);
      setOpacity(random === 3 ? "opacity-50" : "opacity-33");
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    const onShowStatic = () => {
      setOpacity("opacity-100");
    };

    const onHideStatic = () => {
      setOpacity("opacity-33");
    };

    document.addEventListener("showstatic", onShowStatic);
    document.addEventListener("hidestatic", onHideStatic);

    return () => {
      document.removeEventListener("showstatic", onShowStatic);
      document.removeEventListener("hidestatic", onShowStatic);
    };
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("static");

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("gl") || canvas.getContext("2d");
    const scaleFactor = 2.5;
    let samples = [];
    let sampleIndex = 0;
    let scanOffsetY = 0;
    let scanSize = 0;
    const FPS = 60;
    const scanSpeed = FPS * 10;
    const SAMPLE_COUNT = 10;

    const onResize = () => {
      canvas.width = canvas.offsetWidth / scaleFactor;
      canvas.height = canvas.width / (canvas.offsetWidth / canvas.offsetHeight);
      scanSize = canvas.offsetHeight / scaleFactor / 3;
      samples = [];

      for (var i = 0; i < SAMPLE_COUNT; i++)
        samples.push(
          generateRandomSample(context, canvas.width, canvas.height)
        );
    };

    const interpolate = (x, x0, y0, x1, y1) => {
      return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
    };

    const generateRandomSample = (context, w, h) => {
      const intensity = [];
      const factor = h / 50;
      const trans = 1 - Math.random() * 0.05;
      const intensityCurve = [];

      for (var i = 0; i < Math.floor(h / factor) + factor; i++) {
        intensityCurve.push(Math.floor(Math.random() * 15));
      }

      for (var i = 0; i < h; i++) {
        var value = interpolate(
          i / factor,
          Math.floor(i / factor),
          intensityCurve[Math.floor(i / factor)],
          Math.floor(i / factor) + 1,
          intensityCurve[Math.floor(i / factor) + 1]
        );

        intensity.push(value);
      }

      var imageData = context.createImageData(w, h);

      for (var i = 0; i < w * h; i++) {
        var k = i * 4;
        var color = Math.floor(36 * Math.random());

        color += intensity[Math.floor(i / w)];
        imageData.data[k] =
          imageData.data[k + 1] =
          imageData.data[k + 2] =
            color;
        imageData.data[k + 3] = Math.round(255 * trans);
      }

      return imageData;
    };

    const render = () => {
      context.putImageData(samples[Math.floor(sampleIndex)], 0, 0);

      sampleIndex += 20 / FPS; // 1/FPS == 1 second
      if (sampleIndex >= samples.length) sampleIndex = 0;

      var grd = context.createLinearGradient(
        0,
        scanOffsetY,
        0,
        scanSize + scanOffsetY
      );

      grd.addColorStop(0, "rgba(255,255,255,0)");
      grd.addColorStop(0.1, "rgba(255,255,255,0)");
      grd.addColorStop(0.2, "rgba(255,255,255,0.1)");
      grd.addColorStop(0.3, "rgba(255,255,255,0.0)");
      grd.addColorStop(0.45, "rgba(255,255,255,0.1)");
      grd.addColorStop(0.5, "rgba(255,255,255,0.3)");
      grd.addColorStop(0.55, "rgba(255,255,255,0.25)");
      grd.addColorStop(0.6, "rgba(255,255,255,0.25)");
      grd.addColorStop(0.8, "rgba(255,255,255,0.15)");
      grd.addColorStop(1, "rgba(255,255,255,0)");

      context.fillStyle = grd;
      context.fillRect(0, scanOffsetY, canvas.width, scanSize + scanOffsetY);
      context.globalCompositeOperation = "lighter";

      scanOffsetY += canvas.height / scanSpeed;
      if (scanOffsetY > canvas.height) scanOffsetY = -(scanSize / 2);

      requestAnimationFrame(render);
    };

    onResize();

    window.addEventListener("resize", onResize);
    const animationFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full z-30 pointer-events-none ${opacity} transition-all duration-200`}
    >
      <canvas
        id="static"
        className="absolute top-0 left-0 w-full h-full backface-hidden perspective-[1000] pointer-events-none"
      />
    </div>
  );
}

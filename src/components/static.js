"use client";

import { useState, useEffect, useRef } from "react";
import { randomNumberBetween } from "@/utils";

const FPS = 60;
const SPEED = FPS * 10;
const SAMPLE_COUNT = 10;
const SCALE = 2.5;

function interpolate(x, x0, y0, x1, y1) {
  return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
}

function generateRandomSample(context, w, h) {
  try {
    const intensity = [];
    const factor = h / 50;
    const transform = 1 - Math.random() * 0.05;
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
      imageData.data[k] = imageData.data[k + 1] = imageData.data[k + 2] = color;
      imageData.data[k + 3] = Math.round(255 * transform);
    }

    return imageData;
  } catch {
    return null;
  }
}

export default function Static() {
  const [ready, setReady] = useState(false);
  const [opacity, setOpacity] = useState("opacity-90");

  const samplesRef = useRef([]);
  const scanSizeRef = useRef(0);
  const canvasRef = useRef(null);

  const generateStatic = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("gl") || canvas.getContext("2d");

    canvas.width = canvas.offsetWidth / SCALE;
    canvas.height = canvas.width / (canvas.offsetWidth / canvas.offsetHeight);
    scanSizeRef.current = canvas.offsetHeight / SCALE / 3;

    const randomSamples = [];

    for (var i = 0; i < SAMPLE_COUNT; i++) {
      const randomSample = generateRandomSample(
        context,
        canvas.width,
        canvas.height
      );

      if (randomSample) {
        randomSamples.push(randomSample);
      }
    }

    samplesRef.current = randomSamples;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const random = randomNumberBetween(1, 3);
      setOpacity((currentOpacity) => {
        if (currentOpacity === "opacity-100") {
          return currentOpacity;
        }

        return random === 3 ? "opacity-50" : "opacity-33";
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const onShowStatic = () => {
      setOpacity("opacity-100");
      setReady(true);
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
    window.addEventListener("resize", generateStatic);

    return () => {
      window.removeEventListener("resize", generateStatic);
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("gl") || canvas.getContext("2d");

    if (!context) {
      return;
    }

    generateStatic();

    const samples = samplesRef.current;
    const scanSize = scanSizeRef.current;

    let animationFrame;
    let sampleIndex = 0;
    let scanOffsetY = 0;

    const render = () => {
      try {
        context.putImageData(samples[Math.floor(sampleIndex)], 0, 0);

        sampleIndex += 20 / FPS;
        if (sampleIndex >= samples.length) {
          sampleIndex = 0;
        }

        const gradient = context.createLinearGradient(
          0,
          scanOffsetY,
          0,
          scanSize + scanOffsetY
        );

        gradient.addColorStop(0, "rgba(255,255,255,0)");
        gradient.addColorStop(0.1, "rgba(255,255,255,0)");
        gradient.addColorStop(0.2, "rgba(255,255,255,0.1)");
        gradient.addColorStop(0.3, "rgba(255,255,255,0.0)");
        gradient.addColorStop(0.45, "rgba(255,255,255,0.1)");
        gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
        gradient.addColorStop(0.55, "rgba(255,255,255,0.25)");
        gradient.addColorStop(0.6, "rgba(255,255,255,0.25)");
        gradient.addColorStop(0.8, "rgba(255,255,255,0.15)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        context.fillStyle = gradient;
        context.fillRect(0, scanOffsetY, canvas.width, scanSize + scanOffsetY);
        context.globalCompositeOperation = "lighter";

        scanOffsetY += canvas.height / SPEED;

        if (scanOffsetY > canvas.height) {
          scanOffsetY = -(scanSize / 2);
        }

        requestAnimationFrame(render);
      } catch {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      }
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [ready]);

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full z-1 pointer-events-none ${opacity} transition-all duration-200 ${
        opacity !== "opacity-100" ? "mix-blend-screen" : "brightness-75"
      } scale-[1.1]`}
    >
      <canvas
        ref={canvasRef}
        id="static"
        className="absolute top-0 left-0 w-full h-full backface-hidden perspective-[1000] pointer-events-none"
      />
    </div>
  );
}

"use client";

import { useDialKit } from "dialkit";
import { Grainient } from "./grainient";

export function GrainientTuner() {
  const params = useDialKit("Grainient", {
    // Colors
    color1: { type: "color" as const, default: "#09090b" },
    color2: { type: "color" as const, default: "#007069" },
    color3: { type: "color" as const, default: "#a38000" },
    colorBalance: [0, -2, 2],

    // Animation
    timeSpeed: [0.6, 0, 2],

    // Warp
    warpStrength: [1, 0, 5],
    warpFrequency: [10, 0, 20],
    warpSpeed: [3.3, 0, 10],
    warpAmplitude: [50, 1, 200],

    // Blend
    blendAngle: [0, -180, 180],
    blendSoftness: [0.2, 0, 1],

    // Noise / Rotation
    rotationAmount: [300, 0, 1000],
    noiseScale: [5, 0, 10],

    // Grain
    grainAmount: [0.05, 0, 1],
    grainScale: [10, 0.1, 10],
    grainAnimated: false,

    // Color correction
    contrast: [1, 0, 3],
    gamma: [1, 0.1, 3],
    saturation: [1, 0, 3],

    // Camera
    centerX: [0, -1, 1],
    centerY: [0, -1, 1],
    zoom: [1, 0.1, 3],
  });

  return (
    <Grainient
      timeSpeed={params.timeSpeed}
      colorBalance={params.colorBalance}
      warpStrength={params.warpStrength}
      warpFrequency={params.warpFrequency}
      warpSpeed={params.warpSpeed}
      warpAmplitude={params.warpAmplitude}
      blendAngle={params.blendAngle}
      blendSoftness={params.blendSoftness}
      rotationAmount={params.rotationAmount}
      noiseScale={params.noiseScale}
      grainAmount={params.grainAmount}
      grainScale={params.grainScale}
      grainAnimated={params.grainAnimated}
      contrast={params.contrast}
      gamma={params.gamma}
      saturation={params.saturation}
      centerX={params.centerX}
      centerY={params.centerY}
      zoom={params.zoom}
      color1={params.color1}
      color2={params.color2}
      color3={params.color3}
      className="!fixed inset-0 -z-10"
    />
  );
}

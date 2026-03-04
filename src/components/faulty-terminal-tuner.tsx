"use client";

import { useDialKit } from "dialkit";
import { FaultyTerminal } from "./faulty-terminal";

export function FaultyTerminalTuner() {
  const params = useDialKit("FaultyTerminal", {
    scale: [1.5, 0.1, 5],
    gridMulX: [2, 0.5, 10],
    gridMulY: [1, 0.5, 10],
    digitSize: [1.5, 0.5, 5],
    timeScale: [0.3, 0, 2],
    scanlineIntensity: [0.6, 0, 2],
    glitchAmount: [0, 0, 10],
    flickerAmount: [0, 0, 5],
    noiseAmp: [1, 0, 5],
    chromaticAberration: [3, 0, 50],
    dither: [0, 0, 10],
    curvature: [0.52, 0, 1],
    tint: { type: "color" as const, default: "#7a7a7a" },
    mouseReact: true,
    mouseStrength: [0.2, 0, 2],
    pageLoadAnimation: false,
    brightness: [0.1, 0, 3],
    pause: false,
  });

  return (
    <FaultyTerminal
      scale={params.scale}
      gridMul={[params.gridMulX, params.gridMulY]}
      digitSize={params.digitSize}
      timeScale={params.timeScale}
      scanlineIntensity={params.scanlineIntensity}
      glitchAmount={params.glitchAmount}
      flickerAmount={params.flickerAmount}
      noiseAmp={params.noiseAmp}
      chromaticAberration={params.chromaticAberration}
      dither={params.dither}
      curvature={params.curvature}
      tint={params.tint}
      mouseReact={params.mouseReact}
      mouseStrength={params.mouseStrength}
      pageLoadAnimation={params.pageLoadAnimation}
      brightness={params.brightness}
      pause={params.pause}
      className="!fixed inset-0 -z-10"
    />
  );
}

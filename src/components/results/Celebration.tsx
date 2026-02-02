"use client";

import { useEffect, useRef } from "react";

interface CelebrationProps {
  roiPercentage: number;
  trigger: boolean;
}

const ROI_CELEBRATION_THRESHOLD = 200;

export function Celebration({ roiPercentage, trigger }: CelebrationProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (!trigger || fired.current) return;
    if (roiPercentage < ROI_CELEBRATION_THRESHOLD) return;
    fired.current = true;

    const isBigWin = roiPercentage > 500;
    const particleCount = isBigWin ? 60 : 40;

    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      const defaults = { spread: 60, ticks: 80, gravity: 1.2, decay: 0.94, zIndex: 9999 };

      // Burst from both sides
      confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.6 } });
      confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.6 } });

      // Second wave
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: isBigWin ? 40 : 25,
          origin: { x: 0.5, y: 0.4 },
          spread: 90,
        });
      }, 200);
    });
  }, [trigger, roiPercentage]);

  return null;
}

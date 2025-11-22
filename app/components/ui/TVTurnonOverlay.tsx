"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TVTurnonOverlayProps {
  isActive: boolean;
  duration?: number;
  onComplete?: () => void;
}

export default function TVTurnonOverlay({
  isActive,
  duration = 1.0,
  onComplete,
}: TVTurnonOverlayProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isActive) {
      // Complete after animation finishes
      timeoutRef.current = setTimeout(() => {
        if (onComplete) onComplete();
      }, duration * 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, duration, onComplete]);

  if (!isActive) {
    return null;
  }

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[999] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Left panel - slides left (starts from center, moves out first) */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "-100%" }}
            transition={{
              duration: duration * 0.5,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-black"
          />

          {/* Right panel - slides right (starts from center, moves out first) */}
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: duration * 0.5,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-black"
          />

          {/* Top panel - slides up (starts after horizontal panels) */}
          <motion.div
            initial={{ y: "0%" }}
            animate={{ y: "-50%" }}
            transition={{
              duration: duration * 0.5,
              delay: duration * 0.3,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-black"
          />

          {/* Bottom panel - slides down (starts after horizontal panels) */}
          <motion.div
            initial={{ y: "0%" }}
            animate={{ y: "50%" }}
            transition={{
              duration: duration * 0.5,
              delay: duration * 0.3,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-black"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

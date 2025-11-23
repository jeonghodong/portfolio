"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TVShutoffOverlayProps {
  isActive: boolean;
  duration?: number;
  onComplete?: () => void;
}

export default function TVShutoffOverlay({
  isActive,
  duration = 1.0,
  onComplete,
}: TVShutoffOverlayProps) {
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
          {/* White background behind the panels - fades in gradually */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: duration * 0.5,
              ease: "easeIn",
            }}
          />

          {/* Top panel - slides down */}
          <motion.div
            initial={{ y: "-50%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: duration * 0.5,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-black"
          />

          {/* Bottom panel - slides up */}
          <motion.div
            initial={{ y: "50%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: duration * 0.5,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-black"
          />

          {/* Left panel - slides right (starts slightly after vertical) */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: duration * 2,
              delay: duration * 0.3,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-black"
          />

          {/* Right panel - slides left (starts slightly after vertical) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: duration * 2,
              delay: duration * 0.3,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-black"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

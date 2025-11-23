'use client';

import { useEffect, useState } from 'react';

export interface MobileOptimizationConfig {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  particleMultiplier: number; // 0.2 for mobile, 0.5 for tablet, 1.0 for desktop
  geometryDetail: 'low' | 'medium' | 'high';
  enableShadows: boolean;
  enableAntialiasing: boolean;
  maxDPR: number;
  cameraFOV: number;
}

const breakpoints = {
  mobile: 768,
  tablet: 1024,
};

function getOptimizationConfig(width: number): MobileOptimizationConfig {
  const isMobile = width < breakpoints.mobile;
  const isTablet = width >= breakpoints.mobile && width < breakpoints.tablet;
  const isDesktop = width >= breakpoints.tablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
    particleMultiplier: isMobile ? 0.2 : isTablet ? 0.5 : 1.0,
    geometryDetail: isMobile ? 'low' : isTablet ? 'medium' : 'high',
    enableShadows: !isMobile,
    enableAntialiasing: !isMobile,
    maxDPR: isMobile ? 1 : isTablet ? 1.5 : 2,
    cameraFOV: isMobile ? 75 : 60, // Wider FOV on mobile for better view
  };
}

export function useMobileOptimization(): MobileOptimizationConfig {
  const [config, setConfig] = useState<MobileOptimizationConfig>(() => {
    // Check if running on client
    if (typeof window !== 'undefined') {
      return getOptimizationConfig(window.innerWidth);
    }
    // Default to desktop config for SSR
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      particleMultiplier: 1.0,
      geometryDetail: 'high',
      enableShadows: true,
      enableAntialiasing: true,
      maxDPR: 2,
      cameraFOV: 60,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      setConfig(getOptimizationConfig(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return config;
}

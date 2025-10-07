'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '@/app/lib/audio';

interface AudioPlayerProps {
  audioUrl?: string;
  label?: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({ audioUrl, label = 'Listen', autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (audioUrl && autoPlay && !isLoaded) {
      handlePlay();
      setIsLoaded(true);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [audioUrl, autoPlay, isLoaded]);

  const handlePlay = () => {
    if (!audioUrl) return;

    audioManager.play(audioUrl, () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    });

    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      const pos = audioManager.getPosition();
      const dur = audioManager.getDuration();
      setCurrentTime(pos);
      setDuration(dur);
    }, 100);
  };

  const handlePause = () => {
    audioManager.pause();
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleResume = () => {
    audioManager.resume();
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group inline-flex items-center gap-4 px-6 py-3 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all"
    >
      {/* Play/Pause Button */}
      <motion.button
        onClick={isPlaying ? handlePause : (currentTime > 0 ? handleResume : handlePlay)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </motion.button>

      {/* Label & Progress */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">
          {label}
        </span>

        {duration > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '160px' : '100px' }}
            className="flex items-center gap-3"
          >
            {/* Progress Bar */}
            <div className="relative h-1.5 flex-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black dark:bg-white rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Time Display */}
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs font-mono tabular-nums opacity-60 whitespace-nowrap"
              >
                {formatTime(currentTime)} / {formatTime(duration)}
              </motion.span>
            )}
          </motion.div>
        )}
      </div>

      {/* Sound Wave Animation */}
      {isPlaying && (
        <div className="flex items-center gap-1 ml-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-black dark:bg-white rounded-full"
              animate={{
                height: [4, 12, 4],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

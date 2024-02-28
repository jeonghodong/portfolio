import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface MenuProps {
  open: boolean;
}

const index = ({ open }: MenuProps) => {
  const transitionValue = {
    type: 'spring',
    bounce: 0.25,
    duration: 0.4,
  };

  const menuVariants = {
    open: { y: 0, transition: { duration: transitionValue.duration } },
    closed: { y: '-100%', transitionValue },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed top-0 left-0 z-[-1] w-full bg-amber-500 h-2/5 rounded-b-[30px]"
        >
          {/* 메뉴 내용을 여기에 작성합니다. */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default index;

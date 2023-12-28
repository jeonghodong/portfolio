import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MenuTabProps {
  MENU_LIST: string[];
}

const MenuTab = ({ MENU_LIST }: MenuTabProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const topBarVariants = {
    open: { rotate: 45, y: 5.5 },
    closed: { rotate: 0, y: 0 },
  };
  const middleBarVariants = {
    open: { width: '0%' },
    closed: { width: '100%' },
  };
  const bottomBarVariants = {
    open: { rotate: -45, y: -5.5 },
    closed: { rotate: 0, y: 0 },
  };

  const menuVariants = {
    open: { y: 0 },
    closed: { y: '-100%' },
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className="lg:hidden border-[2px] border-[white] rounded-[20px] w-[110px] h-[40px] flex justify-center items-center py-[12px] px-[20px]  cursor-pointer"
      >
        <div>
          <p className="text-[white] text-[12px]">Menu</p>
        </div>
        <div className="ml-2 flex flex-col gap-[3.5px]">
          <motion.div
            className="w-[25px] h-[2px] bg-white"
            variants={topBarVariants}
            animate={isOpen ? 'open' : 'closed'}
          />
          <motion.div
            className="w-[25px] h-[2px] bg-white"
            variants={middleBarVariants}
            animate={isOpen ? 'open' : 'closed'}
          />
          <motion.div
            className="w-[25px] h-[2px] bg-white"
            variants={bottomBarVariants}
            animate={isOpen ? 'open' : 'closed'}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 left-0 z-[-1] w-full bg-amber-500 h-4/5 lg:hidden"
          >
            {/* 메뉴 내용을 여기에 작성합니다. */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuTab;

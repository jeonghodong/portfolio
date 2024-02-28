import { motion } from 'framer-motion';
import { useState } from 'react';
import Menu from '../Menu';

const MenuTab = () => {
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

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      onClick={handleClick}
      className="lg:hidden border-[2px] border-[white] rounded-[20px] w-[110px] h-[40px] flex justify-center items-center py-[12px] px-[20px] cursor-pointer"
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
      <Menu open={isOpen} />
    </div>
  );
};

export default MenuTab;

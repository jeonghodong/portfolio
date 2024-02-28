import logo from '@/assets/images/logo.webp';
import Image from 'next/image';
import MenuTab from '../MenuTab';

const ALL_MENU_LIST = ['About', 'Skills', 'Works', 'Contact', 'MODE'];

const LEFT_MENU_ITEM = ['About', 'Skills', 'Works'];
const RIGHT_MENU_ITEM = ['Contact', 'MODE'];

const Header = () => {
  return (
    <div className="w-[100%] min-w-[200px] h-[77px] p-10 mb-[33px] border-b-[.5px] border-[#959692] sm:border-none items-center flex">
      <div>
        <Image src={logo} alt="로고 사진" width={220} height={220} />
      </div>
      <div className="flex justify-between w-full ">
        <div className="pl-[50px] hidden lg:flex text-teal-800 text-[20px] gap-7 font-bold cursor-pointer">
          {LEFT_MENU_ITEM.map((item, index) => (
            <p key={index} className="transition duration-300 hover:text-green-200 ">
              {item}
            </p>
          ))}
        </div>
        <div className="pl-[50px] sm:hidden flex text-teal-800 text-[20px] gap-7 font-bold cursor-pointer">
          {RIGHT_MENU_ITEM.map((item, index) => (
            <p key={index} className="transition duration-300 hover:text-green-200 ">
              {item}
            </p>
          ))}
        </div>
      </div>
      <MenuTab MENU_LIST={ALL_MENU_LIST} />
    </div>
  );
};

export default Header;

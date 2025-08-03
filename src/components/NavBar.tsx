import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { RiMenuSearchFill } from "react-icons/ri";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import { CiUser } from "react-icons/ci";

export const NavBar = ({
  menuHandler,
  menu,
}: {
  menuHandler: () => void;
  menu: boolean;
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex  items-center gap-4">
          <div
            onClick={menu ? undefined : () => menuHandler()}
            className={`transition-all duration-200 ease-in-out ${
              menu ? "pointer-events-none  text-slate-500" : "text-white"
            }`}
          >
            <FaAngleLeft className="cursor-pointer  w-6 h-6" />
          </div>

          <div
            onClick={menu ? menuHandler : undefined}
            className={`transition-all duration-200 ease-in-out ${
              menu ? "text-white" : "pointer-events-none text-slate-500"
            }`}
          >
            <FaAngleRight className="cursor-pointer  w-6 h-6" />
          </div>

          <div
            className="flex items-center px-2 pl-5 py-3 w-[320px]
            gap-3 border border-gray-700 rounded-3xl
            text-white min-w-0"
          >
            <IoIosSearch className="text-gray-400 w-6 h-6" />
            <input
              className="text-white bg-transparent outline-none flex-1 min-w-0"
              placeholder="Search Anything"
            />
            <RiMenuSearchFill className="text-gray-400 w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-4 text-white">
          <LuMessageCircleMore className=" w-7 h-7 cursor-pointer" />
          <IoIosNotifications className=" w-7 h-7 cursor-pointer" />
          <CiUser className=" w-7 h-7 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

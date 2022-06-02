import Image from "next/image";
import React, { useState } from "react";
import {
  HeartIcon,
  MenuIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  SearchIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useRecoilState(modalState);

  return (
    <div className="shadow-sm border-b bg-white sticky top-0 z-50">
      <div className="flex justify-between max-w-6xl mx-auto p-2 items-center">
        {/*Left*/}
        <div
          onClick={() => router.push("/")}
          className="relative hidden lg:inline-grid h-24 w-24 cursor-pointer"
        >
          <Image
            src="https://links.papareact.com/ocw"
            layout="fill"
            objectFit="contain"
          ></Image>
        </div>

        <div
          onClick={() => router.push("/")}
          className="relative w-10 h-10 lg:hidden flex-shrink-0 cursor-pointer"
        >
          <Image
            src="https://links.papareact.com/jjm"
            layout="fill"
            objectFit="contain"
          ></Image>
        </div>
        {/*Middle - Search*/}
        <div className="max-w-xs">
          <div className="relative block">
            <span className="sr-only">Search</span>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <SearchIcon className="h-6 w-6 text-gray-500"></SearchIcon>
            </div>
            <input
              className=" placeholder:text-slate-500 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-black sm:text-sm "
              placeholder="Search"
              type="text"
            />
          </div>
        </div>
        {/*right*/}
        <div className="flex items-center justify-end space-x-4">
          <MenuIcon
            className="h-6 md:hidden cursor-pointer hover:scale-125 transition ease-out"
            onClick={() => setMobileOpen(!mobileOpen)}
          ></MenuIcon>
          <HomeIcon
            onClick={() => router.push("/")}
            className="navButton"
          ></HomeIcon>

          {session ? (
            <>
              <div className="relative navButton">
                <PaperAirplaneIcon className="navButton rotate-45"></PaperAirplaneIcon>
                <div className="absolute -top-2 -right-1 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white">
                  3
                </div>
              </div>
              <PlusCircleIcon
                onClick={() => setOpen(true)}
                className="navButton"
              ></PlusCircleIcon>
              <UserGroupIcon className="navButton"></UserGroupIcon>
              <HeartIcon className="navButton"></HeartIcon>

              <img
                onClick={signOut}
                src={session.user.image}
                alt="user profile pic"
                className="h-10 w-10 object-cover rounded-full cursor-pointer"
              />
            </>
          ) : (
            <button onClick={signIn}>Sign In</button>
          )}
        </div>
      </div>
      {/*mobile navbar */}
      <div
        className={`${
          mobileOpen ? "h-12 w-full " : "h-0 w-0 "
        } flex  space-x-4   items-center justify-around transition-[height_width] duration-300 md:hidden`}
      >
        <HomeIcon
          onClick={() => router.push("/")}
          className="h-8 w-8 cursor-pointer hover:scale-125 transition-all ease-out"
        ></HomeIcon>
        <div className="relative cursor-pointer hover:scale-125 transition-all ease-out ">
          <PaperAirplaneIcon className="h-8 w-8 rotate-45"></PaperAirplaneIcon>
          <div
            className={`absolute -top-2 -right-1 text-xs w-5 h-5 bg-red-500 rounded-full ${
              mobileOpen ? "flex" : "hidden"
            } items-center justify-center animate-pulse text-white`}
          >
            3
          </div>
        </div>
        <PlusCircleIcon
          onClick={() => setOpen(true)}
          className="h-8 w-8 cursor-pointer hover:scale-125 transition-all ease-out"
        ></PlusCircleIcon>
        <UserGroupIcon className="h-8 w-8 cursor-pointer hover:scale-125 transition-all ease-out"></UserGroupIcon>
        <HeartIcon className="h-8 w-8 cursor-pointer hover:scale-125 transition-all ease-out"></HeartIcon>
      </div>
    </div>
  );
};

export default Header;

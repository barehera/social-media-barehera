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
import { AiOutlineMessage } from "react-icons/ai";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useRecoilState(modalState);

  return (
    <div className="shadow-sm border-b bg-white sticky top-0 z-50">
      <div className="flex justify-between max-w-5xl mx-auto p-1 md:py-1 items-center">
        {/*Left*/}
        <div
          onClick={() => router.push("/")}
          className="relative inline-grid h-12 w-24 cursor-pointer"
        >
          <Image
            src="https://links.papareact.com/ocw"
            layout="fill"
            objectFit="contain"
          ></Image>
        </div>

        {/*Middle - Search*/}
        <div className="max-w-xs  hidden md:flex">
          <div className="relative block ">
            <span className="sr-only">Search</span>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <SearchIcon className="h-6 w-6 text-gray-500"></SearchIcon>
            </div>
            <input
              className="w-80 placeholder:text-slate-500 block bg-gray-100  border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-black sm:text-sm "
              placeholder="Search"
              type="text"
            />
          </div>
        </div>
        {/*right*/}
        <div className="flex items-center justify-end space-x-4">
          <HomeIcon
            onClick={() => router.push("/")}
            className="navButton"
          ></HomeIcon>

          {session ? (
            <>
              <div className="relative navButton">
                <AiOutlineMessage className="navButton"></AiOutlineMessage>
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
                onClick={() => router.push(`/${session.user.username}`)}
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
    </div>
  );
};

export default Header;

import Image from "next/image";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import {
  AiOutlineMessage,
  AiOutlinePlusCircle,
  AiOutlineSearch,
  AiOutlineLogout,
  AiOutlineHome,
} from "react-icons/ai";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useRecoilState(modalState);

  return (
    <div className="shadow-sm border-b bg-white sticky top-0 z-30">
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
              <AiOutlineSearch className="h-6 w-6 text-gray-500"></AiOutlineSearch>
            </div>
            <input
              className="w-80 placeholder:text-slate-500 block bg-gray-100  border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-black sm:text-sm "
              placeholder="Work in Progress..."
              type="text"
            />
          </div>
        </div>
        {/*right*/}
        <div className="flex items-center justify-end space-x-4">
          <AiOutlineSearch
            className="navButton md:hidden"
            onClick={() => alert("work in progress!")}
          ></AiOutlineSearch>
          <AiOutlineHome
            onClick={() => router.push("/")}
            className="navButton"
          ></AiOutlineHome>

          {session ? (
            <>
              <AiOutlineMessage
                className="navButton"
                onClick={() => router.push(`/direct`)}
              ></AiOutlineMessage>
              <AiOutlinePlusCircle
                onClick={() => setOpen(true)}
                className="navButton"
              ></AiOutlinePlusCircle>
              <AiOutlineLogout
                className="navButton"
                onClick={signOut}
              ></AiOutlineLogout>

              <img
                onClick={() => router.push(`/${session.user.username}`)}
                src={session.user.image}
                alt=""
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

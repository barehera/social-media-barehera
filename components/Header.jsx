import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
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
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Header = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useRecoilState(modalState);
  const [inputText, setInputText] = useState("");

  const inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const filteredUser = users.filter((user) => {
    //if no input the return the original
    if (inputText === "") {
      return user.username;
    }
    //return the item which contains the user input
    else {
      return user.username.toLowerCase().includes(inputText);
    }
  });

  useEffect(() => {
    if (inputText.length > 0) {
      setSearchOpen(true);
    } else {
      setSearchOpen(false);
    }
  }, [inputText]);

  useEffect(() => {
    const getUsers = async () => {
      setUsers([]);
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUsers((users) => [...users, { ...doc.data(), id: doc.id }]);
      });
    };
    getUsers();
  }, []);
  return (
    <div className="shadow-sm border-b bg-white sticky top-0 z-30">
      <div className="flex justify-between max-w-5xl mx-auto p-1 md:py-1 items-center">
        {/*Left*/}
        <img
          onClick={() => router.push("/")}
          src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
          alt=""
          className="relative inline-grid h-12 w-24 cursor-pointer object-contain"
        />

        {/*Middle - Search*/}
        <div className="max-w-xs  hidden md:flex">
          <div className="relative block ">
            <span className="sr-only">Search</span>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <AiOutlineSearch className="h-6 w-6 text-gray-500"></AiOutlineSearch>
            </div>
            <input
              className="w-80 placeholder:text-slate-500 block bg-gray-100  border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-black sm:text-sm "
              placeholder="Search"
              type="text"
              onChange={inputHandler}
            />
          </div>
          {searchOpen && (
            <div className="bg-white w-96 h-48 absolute -bottom-48 border overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              {filteredUser.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-x-2 p-2 cursor-pointer hover:bg-gray-100 transition-all ease-out"
                  onClick={() => router.push(`/${user.username}`)}
                >
                  <img
                    src={user.profileImg}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <p>{user.username}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/*right*/}
        <div className="flex items-center justify-end space-x-1 sm:space-x-2  md:space-x-3 lg:space-x-4">
          <AiOutlineSearch
            className="navButton md:hidden"
            onClick={() => router.push("/search")}
          ></AiOutlineSearch>
          <AiOutlineHome
            onClick={() => router.push("/")}
            className="navButton"
          ></AiOutlineHome>

          {session ? (
            <>
              <AiOutlineUsergroupAdd
                className="navButton xl:hidden"
                onClick={() => router.push(`/suggestions`)}
              ></AiOutlineUsergroupAdd>
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

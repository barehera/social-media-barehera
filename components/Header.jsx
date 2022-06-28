import Image from "next/image";
import React, { useEffect, useState } from "react";

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
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
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
      if (user) {
        setUsers([]);
        const q = query(
          collection(db, "users"),
          where("username", "!=", user.username)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          setUsers((users) => [...users, { ...doc.data(), id: doc.id }]);
        });
      }
    };
    getUsers();
  }, [user]);

  return (
    <div className="shadow-sm border-b bg-white sticky top-0 z-30">
      <div className="flex justify-between max-w-5xl mx-auto p-1 md:py-1 items-center">
        {/*Left*/}
        <h1
          className="text-3xl font-serif tracking-tighter cursor-pointer px-2"
          onClick={() => router.push("/")}
        >
          barehera.
        </h1>

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
              value={inputText}
              onChange={inputHandler}
            />
          </div>
          {searchOpen && (
            <div className="bg-white w-96 h-48 absolute -bottom-48 border overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              {filteredUser.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-x-2 p-2 cursor-pointer hover:bg-gray-100 transition-all ease-out"
                  onClick={() => {
                    setInputText("");
                    setSearchOpen(false);
                    router.push(`/${user.username}`);
                  }}
                >
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
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

          {user ? (
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
                onClick={logout}
              ></AiOutlineLogout>

              <img
                onClick={() => router.push(`/${user.username}`)}
                src={user.photoURL}
                alt=""
                className="h-10 w-10 object-cover rounded-full cursor-pointer"
              />
            </>
          ) : (
            <button onClick={() => router.push("/login")}>Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

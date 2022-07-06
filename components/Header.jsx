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
import {
  collection,
  query,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { unreadMessagesCount } from "../atoms/messagesUsersAtom";

const Header = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useRecoilState(modalState);
  const [inputText, setInputText] = useState("");
  const [unreadMessage, setUnreadMessage] = useRecoilState(unreadMessagesCount);

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
        const count = 0;
        querySnapshot.forEach((messageUser) => {
          const unsubscribe = onSnapshot(
            query(
              collection(
                db,
                "users",
                user.uid,
                "messages",
                messageUser.id,
                "messages"
              ),
              where("owner", "!=", user.uid)
            ),
            (messages) => {
              if (!messages.empty) {
                messages.docs.map((message) => {
                  if (!message.data().read) {
                    count += 1;
                  }
                });
                setUnreadMessage(count);
              }
            }
          );
          return unsubscribe;
        });
      }
    };
    getUsers();
  }, [user, db]);

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
              onChange={inputHandler}
              value={inputText}
            />
          </div>
          {searchOpen && (
            <div className="bg-white w-96 h-48 absolute -bottom-48 border overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              {filteredUser.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-x-2 p-2 cursor-pointer hover:bg-gray-100 transition-all ease-out"
                  onClick={() => {
                    setSearchOpen(false);
                    setInputText("");
                    router.push(`/${user.username}`);
                  }}
                >
                  <Image
                    src={user.photoURL}
                    width={40}
                    height={40}
                    className="rounded-full"
                    objectFit="cover"
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
              <div
                className="relative navButton"
                onClick={() => router.push(`/direct`)}
              >
                <AiOutlineMessage className="navButton"></AiOutlineMessage>
                {unreadMessage > 0 && (
                  <div className="absolute -top-1 animate-ping -right-1 w-3 h-3 bg-teal-500 rounded-full flex items-center justify-center  text-white"></div>
                )}
              </div>

              <AiOutlinePlusCircle
                onClick={() => setOpen(true)}
                className="navButton"
              ></AiOutlinePlusCircle>

              <AiOutlineLogout
                className="navButton"
                onClick={logout}
              ></AiOutlineLogout>
              <div>
                <Image
                  src={user.photoURL}
                  onClick={() => router.push(`/${user.username}`)}
                  width={48}
                  height={48}
                  className="rounded-full cursor-pointer"
                  objectFit="cover"
                  quality={100}
                />
              </div>
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

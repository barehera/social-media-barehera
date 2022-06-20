import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { AiOutlineSearch } from "react-icons/ai";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";

const search = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div>
      <Header></Header>
      <div className="flex items-center justify-center mt-5 ">
        <div className="flex flex-col items-center justify-center w-full mx-4">
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

          {searchOpen ? (
            <div className="flex flex-col w-full gap-x-2 mt-5 ">
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
          ) : (
            <p className="text-xl text-gray-500 mt-5">Find your friends...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default search;

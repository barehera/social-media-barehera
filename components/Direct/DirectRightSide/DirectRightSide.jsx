import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { messagesSelectedUser } from "../../../atoms/messagesUsersAtom";
import { AiOutlineSend, AiOutlineClose } from "react-icons/ai";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import Moment from "react-moment";
import { useAuth } from "../../../context/AuthContext";

const DirectRightSide = () => {
  const [selectedUser, setSelectedUser] = useRecoilState(messagesSelectedUser);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  //Getting messages
  useEffect(() => {
    setMessages([]);
    if (user && selectedUser) {
      const unsubscribe = onSnapshot(
        query(
          collection(
            db,
            "users",
            user?.uid,
            "messages",
            selectedUser?.id,
            "messages"
          ),
          orderBy("timestamp", "asc")
        ),
        (querySnapshot) => {
          setMessages([]);
          querySnapshot.forEach((doc) => {
            setMessages((messages) => [
              ...messages,
              { ...doc.data(), id: doc.id },
            ]);
          });
        }
      );
      return unsubscribe;
    }
  }, [selectedUser]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (inputMessage.trim().length !== 0) {
      // Session User Create message
      setInputMessage("");
      await addDoc(
        collection(
          db,
          "users",
          user?.uid,
          "messages",
          selectedUser?.id,
          "messages"
        ),
        {
          message: inputMessage,
          owner: user.uid,
          read: false,
          timestamp: serverTimestamp(),
        }
      );
      await addDoc(
        collection(
          db,
          "users",
          selectedUser.id,
          "messages",
          user.uid,
          "messages"
        ),
        {
          message: inputMessage,
          owner: user.uid,
          read: false,
          timestamp: serverTimestamp(),
        }
      );
    } else {
      alert("Cannot send empty message");
    }
  };

  return (
    <>
      <div
        className={`${
          selectedUser ? "block w-full" : "hidden"
        }  md:block md:w-4/6`}
      >
        {selectedUser ? (
          <div className="w-full h-full flex flex-col ">
            {/*Header */}
            <div className="flex items-center h-16 border-b px-5">
              <div className="flex items-center flex-1">
                <div
                  onClick={() => router.push(`/${selectedUser.username}`)}
                  className="flex items-center cursor-pointer "
                >
                  <img
                    src={selectedUser?.photoURL}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <h3 className="text-sm font-semibold ml-2">
                    {selectedUser?.username}
                  </h3>
                </div>
              </div>
              {selectedUser && (
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedUser(null)}
                >
                  <AiOutlineClose size={20}></AiOutlineClose>
                </div>
              )}
            </div>
            {/*Messages */}
            <div className="flex-1  py-2 px-6 flex flex-col gap-y-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-200">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-center relative   ${
                    message.owner === user.uid ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.owner !== user.uid ? (
                    <div className="flex items-baseline gap-x-2 mb-5 ">
                      <img
                        src={selectedUser.photoURL}
                        className="w-7 h-7 rounded-full object-cover"
                      ></img>
                      <div className="relative">
                        <p className="bg-white border  rounded-3xl p-3 text-sm w-36 sm:w-52 md:w-96 break-words">
                          {message.message}
                        </p>
                        <Moment
                          interval={1000}
                          className="text-[10px]  text-gray-500 absolute left-0"
                          fromNow
                        >
                          {message.timestamp?.toDate()}
                        </Moment>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-x-2 mb-5">
                      <div className="relative">
                        <p className="bg-gray-100 rounded-3xl p-3 text-sm w-36 sm:w-52 md:w-96 break-words">
                          {message.message}
                        </p>
                        <Moment
                          interval={1000}
                          className="text-[10px]  text-gray-500 absolute right-0"
                          fromNow
                        >
                          {message.timestamp?.toDate()}
                        </Moment>
                      </div>

                      <img
                        src={user.photoURL}
                        className="w-7 h-7 rounded-full object-cover"
                      ></img>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ))}
            </div>
            {/*Send Message Input */}
            <form
              className="flex items-center justify-center relative w-full mb-4"
              onSubmit={sendMessage}
            >
              <input
                type="text"
                className="w-full rounded-full mx-4 border-gray-300 placeholder:text-xs pr-12"
                placeholder="Message..."
                onChange={(e) => setInputMessage(e.target.value)}
                value={inputMessage}
              />
              <AiOutlineSend
                size={24}
                className="text-gray-500 absolute right-8 cursor-pointer"
                onClick={sendMessage}
              ></AiOutlineSend>
            </form>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center flex-col p-4 gap-y-2">
            <svg
              aria-label="Direct"
              color="#262626"
              fill="#262626"
              height="96"
              role="img"
              viewBox="0 0 96 96"
              width="96"
            >
              <circle
                cx="48"
                cy="48"
                fill="none"
                r="47"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></circle>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="69.286"
                x2="41.447"
                y1="33.21"
                y2="48.804"
              ></line>
              <polygon
                fill="none"
                points="47.254 73.123 71.376 31.998 24.546 32.002 41.448 48.805 47.254 73.123"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
              ></polygon>
            </svg>
            <h4 className="font-light text-2xl">Mesajların</h4>
            <p className="text-sm text-center text-gray-500">
              Bir arkadaşına veya gruba gizli fotoğraflar ve mesajlar gönder.
            </p>
          </div>
        )}

        {/*Selected Message */}
      </div>
    </>
  );
};

export default DirectRightSide;

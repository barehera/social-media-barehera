import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { messagesSelectedUser } from "../../../../atoms/messagesUsersAtom";
import { useSession } from "next-auth/react";
import { db } from "../../../../firebase";
import Moment from "react-moment";
import { FaSpinner } from "react-icons/fa";

const UserMessageCard = ({ user }) => {
  const [selectedUser, setSelectedUser] = useRecoilState(messagesSelectedUser);
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    if (session) {
      const unsubscribe = onSnapshot(
        query(
          collection(
            db,
            "users",
            session?.user?.uid,
            "messages",
            user.id,
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
          setLoading(false);
        }
      );
      return unsubscribe;
    }
  }, [session]);

  useEffect(() => {
    const checkRead = () => {
      const count = 0;
      messages.map((message) => {
        if (message.read === false && session.user.username !== message.owner) {
          count += 1;
        }
      });
      setUnreadMessages(count);
    };
    checkRead();
  }, [messages]);

  const readMessage = () => {
    messages.map(async (message) => {
      if (message.owner !== session.user.username && message.read === false) {
        const MessageRef = doc(
          db,
          "users",
          session.user.uid,
          "messages",
          user.id,
          "messages",
          message.id
        );
        await updateDoc(MessageRef, {
          read: true,
        });
      }
    });
  };

  return (
    <div
      onClick={() => {
        setSelectedUser(user);
        readMessage();
      }}
      className={`flex items-center px-4 py-2 hover:bg-gray-100 transition-all ease-out cursor-pointer ${
        selectedUser && user.id === selectedUser.id && "bg-gray-100"
      }`}
    >
      {loading ? (
        <div className="w-full h-14 px-4 py-2 flex items-center justify-center">
          <FaSpinner className="animate-spin"></FaSpinner>
        </div>
      ) : (
        <>
          <img
            src={user.profileImg}
            alt=""
            className="w-14 h-14 rounded-full"
          />
          <div className="ml-4 flex-1">
            <h4 className="text-sm font-semibold">{user.username}</h4>
            {messages && (
              <div className=" text-gray-500 flex flex-col items-start gap-x-1">
                <p className="text-sm">
                  {messages[messages.length - 1]?.message.slice(0, 25)}
                  {messages[messages.length - 1]?.message.length > 25 && "..."}
                </p>
                {messages[messages.length - 1]?.timestamp && (
                  <Moment
                    interval={1000}
                    className="text-xs  text-gray-500 "
                    fromNow
                  >
                    {messages[messages.length - 1]?.timestamp?.toDate()}
                  </Moment>
                )}
              </div>
            )}
          </div>
          <div>
            {unreadMessages > 0 && (
              <p className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white animate-pulse">
                {unreadMessages}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserMessageCard;

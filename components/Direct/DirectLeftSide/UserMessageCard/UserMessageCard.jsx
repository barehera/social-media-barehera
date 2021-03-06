import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  where,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  messagesSelectedUser,
  unreadMessagesCount,
} from "../../../../atoms/messagesUsersAtom";
import { db } from "../../../../firebase";
import Moment from "react-moment";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../../context/AuthContext";
import Image from "next/image";
import SkeletonLoader from "./SkeletonLoader";

const UserMessageCard = ({ messageUser }) => {
  const [selectedUser, setSelectedUser] = useRecoilState(messagesSelectedUser);
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [unreadMessage, setUnreadMessage] = useRecoilState(unreadMessagesCount);
  useEffect(() => {
    setMessages([]);
    setLoading(true);
    if (user) {
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
  }, [user]);

  useEffect(() => {
    const checkRead = () => {
      const count = 0;
      messages.map((message) => {
        if (message.read === false && user.uid !== message.owner) {
          count += 1;
        }
      });
      setUnreadMessages(count);
    };
    checkRead();
  }, [messages]);

  const readMessage = () => {
    messages.map(async (message) => {
      if (message.owner !== user.uid && message.read === false) {
        const MessageRef = doc(
          db,
          "users",
          user.uid,
          "messages",
          messageUser.id,
          "messages",
          message.id
        );
        await updateDoc(MessageRef, {
          read: true,
        });
      }
    });

    const getUsers = async () => {
      if (user) {
        const q = query(
          collection(db, "users"),
          where("username", "!=", user.username)
        );
        const querySnapshot = await getDocs(q);

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
  };

  return (
    <div
      onClick={() => {
        setSelectedUser(messageUser);
        readMessage();
      }}
      className={`flex items-center px-4 py-2 hover:bg-gray-100 transition-all ease-out cursor-pointer ${
        selectedUser && messageUser.id === selectedUser.id && "bg-gray-100"
      }`}
    >
      {loading ? (
        <>
          <SkeletonLoader></SkeletonLoader>
        </>
      ) : (
        <>
          <Image
            src={messageUser.photoURL}
            width={56}
            height={56}
            className="rounded-full"
            objectFit="cover"
          />

          <div className="ml-4 flex-1">
            <h4 className="text-sm font-semibold">{messageUser.username}</h4>
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
              <p className="bg-teal-500 rounded-full w-6 h-6 flex items-center justify-center text-white animate-pulse">
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

import React, { useEffect } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import UserMessageCard from "./UserMessageCard/UserMessageCard";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRecoilState } from "recoil";
import {
  messagesSelectedUser,
  messagesUsers,
} from "../../../atoms/messagesUsersAtom";
import { useAuth } from "../../../context/AuthContext";

const DirectLeftSide = () => {
  const [users, setUsers] = useRecoilState(messagesUsers);
  const [selectedUser, setSelectedUser] = useRecoilState(messagesSelectedUser);
  const { user } = useAuth();

  useEffect(() => {
    setUsers([]);
    if (user) {
      const unsub = onSnapshot(
        query(collection(db, "users"), where("username", "!=", user.username)),
        (snapshot) => {
          snapshot.docs.forEach((doc) =>
            setUsers((users) => [...users, { ...doc.data(), id: doc.id }])
          );
        }
      );
      return unsub;
    }
  }, [db, user]);
  return (
    <div
      className={`${
        selectedUser ? "hidden md:block" : "block"
      } w-full md:w-2/6 h-full border-r `}
    >
      {/*session username*/}
      <div className="h-16 flex items-center justify-center relative border-b">
        <h1 className="font-semibold text-sm">{user.username}</h1>
      </div>
      {/*session users messages */}
      <div className="py-3 overflow-auto max-h-[calc(100%_-_61px)] scrollbar-thin scrollbar-thumb-gray-200">
        {users.length > 0 ? (
          <>
            {users?.map((messageUser) => (
              <UserMessageCard
                key={messageUser.id}
                messageUser={messageUser}
              ></UserMessageCard>
            ))}
          </>
        ) : (
          <p className="text-center">No one to chat</p>
        )}
      </div>
    </div>
  );
};

export default DirectLeftSide;

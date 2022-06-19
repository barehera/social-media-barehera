import React, { useEffect } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import UserMessageCard from "./UserMessageCard/UserMessageCard";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRecoilState } from "recoil";
import { messagesUsers } from "../../../atoms/messagesUsersAtom";
import { useSession } from "next-auth/react";

const DirectLeftSide = () => {
  const [users, setUsers] = useRecoilState(messagesUsers);
  const { data: session } = useSession();

  useEffect(() => {
    setUsers([]);
    if (session) {
      const unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("username", "!=", session?.user?.username)
        ),
        (snapshot) => {
          snapshot.docs.forEach((doc) =>
            setUsers((users) => [...users, { ...doc.data(), id: doc.id }])
          );
        }
      );
      return unsub;
    }
  }, [db, session]);
  return (
    <div className="w-3/6 md:w-2/6 h-full border-r ">
      {/*session username*/}
      <div className="h-16 flex items-center justify-center relative border-b">
        <h1 className="font-semibold text-sm">{session?.user?.username}</h1>
      </div>
      {/*session users messages */}
      <div className="py-3 overflow-auto max-h-[calc(100%_-_61px)] scrollbar-thin scrollbar-thumb-gray-200">
        {users?.map((user) => (
          <UserMessageCard key={user.id} user={user}></UserMessageCard>
        ))}
      </div>
    </div>
  );
};

export default DirectLeftSide;

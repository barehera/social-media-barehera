import React, { useEffect, useState } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import UserMessageCard from "./UserMessageCard/UserMessageCard";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

const DirectLeftSide = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      snapshot.docs.forEach((doc) =>
        setUsers((users) => [...users, { ...doc.data(), id: doc.id }])
      );
    });
    return unsub;
  }, [db]);
  return (
    <div className="w-2/6 h-full border-r">
      {/*session username and create message */}
      <div className="p-5 flex items-center justify-center relative border-b">
        <h1 className="font-semibold text-sm">mircagi</h1>
        <div className="absolute right-5 cursor-pointer hover:scale-110 transition-all">
          <BiMessageSquareEdit size={24}></BiMessageSquareEdit>
        </div>
      </div>
      {/*session user and users messages */}
      <div className="py-3 overflow-auto max-h-[calc(100%_-_61px)] scrollbar-thin scrollbar-thumb-gray-200">
        {users?.map((user) => (
          <UserMessageCard key={user.id} user={user}></UserMessageCard>
        ))}
      </div>
    </div>
  );
};

export default DirectLeftSide;

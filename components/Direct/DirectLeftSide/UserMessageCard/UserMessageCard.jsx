import React from "react";
import { useSession } from "next-auth/react";

const UserMessageCard = ({ user }) => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center px-4 pb-3 hover:bg-gray-50 transition-all cursor-pointer">
      <img src={user.profileImg} alt="" className="w-14 h-14 rounded-full" />
      <div className="ml-4">
        <h4 className="text-sm font-semibold">{user.username}</h4>
        <p className="text-sm text-gray-500">Seni cok seviyorum &#x2022; 17s</p>
      </div>
    </div>
  );
};

export default UserMessageCard;

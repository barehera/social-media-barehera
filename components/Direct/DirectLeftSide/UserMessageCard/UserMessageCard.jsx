import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { messagesSelectedUser } from "../../../../atoms/messagesUsersAtom";

const UserMessageCard = ({ user }) => {
  const [selectedUser, setSelectedUser] = useRecoilState(messagesSelectedUser);

  return (
    <div
      onClick={() => setSelectedUser(user)}
      className={`flex items-center px-4 pb-3 hover:bg-gray-100 transition-all ease-out cursor-pointer ${
        selectedUser && user.id === selectedUser.id && "bg-gray-100"
      }`}
    >
      <img src={user.profileImg} alt="" className="w-14 h-14 rounded-full" />
      <div className="ml-4">
        <h4 className="text-sm font-semibold">{user.username}</h4>
        <p className="text-sm text-gray-500">Seni cok seviyorum &#x2022; 17s</p>
      </div>
    </div>
  );
};

export default UserMessageCard;

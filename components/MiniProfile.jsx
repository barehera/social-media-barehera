import React from "react";
import { signOut, useSession } from "next-auth/react";

const MiniProfile = () => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center space-x-4 ">
      <img
        src={session.user.image}
        alt=""
        className="rounded-full border p-[2px] w-16 h-16 object-cover"
      ></img>
      <div className="flex-1">
        <h2 className="font-bold">{session.user.username}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>

      <button className="text-blue-400 text-sm font-semibold" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
};

export default MiniProfile;

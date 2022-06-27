import React from "react";
import { useAuth } from "../../../context/AuthContext";

const MiniProfile = () => {
  const { user, logout } = useAuth();
  return (
    <div className="flex items-center space-x-4 ">
      <img
        src={user.photoURL}
        alt=""
        className="rounded-full border p-[2px] w-16 h-16 object-cover"
      ></img>
      <div className="flex-1">
        <h2 className="font-bold">{user.username}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Barehera</h3>
      </div>

      <button
        className="text-blue-400 text-sm font-semibold hover:scale-110 transition-all duration-300 ease-out"
        onClick={logout}
      >
        Sign Out
      </button>
    </div>
  );
};

export default MiniProfile;

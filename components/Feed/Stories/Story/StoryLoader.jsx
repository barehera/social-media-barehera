import React from "react";
import { FaSpinner } from "react-icons/fa";

const StoryLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center animate-pulse ">
      <div className="rounded-full w-16 h-16 p-[2px] border-2 border-red-500 flex items-center justify-center mb-1">
        <FaSpinner size={20} className="animate-spin"></FaSpinner>
      </div>

      <h2 className="text-xs w-14 text-center">Loading...</h2>
    </div>
  );
};

export default StoryLoader;

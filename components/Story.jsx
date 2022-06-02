import React from "react";
import { BsPlusCircle } from "react-icons/bs";

const Story = ({ img, username, self }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <img
          src={img}
          alt="user pic"
          className={`rounded-full w-14 h-14 border-2 ${
            self && "!border-gray-300"
          } border-red-500 p-[2px] object-contain cursor-pointer hover:scale-110 transition-all duration-200 ease-out`}
        />
        {self && (
          <BsPlusCircle
            size={20}
            className="text-gray-100 absolute top-0 right-0 bg-gray-400 rounded-full"
          ></BsPlusCircle>
        )}
      </div>
      <h2 className="text-xs w-14 text-center">{username.slice(0, 7)}... </h2>
    </div>
  );
};

export default Story;

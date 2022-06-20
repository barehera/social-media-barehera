import React from "react";
import { BsPlusCircle } from "react-icons/bs";

const Story = ({ img, username, self }) => {
  return (
    <div
      className="flex flex-col items-center justify-center "
      onClick={() => alert("work in progress!")}
    >
      <div className="relative w-16 h-16 mb-1">
        <img
          src={img}
          alt=""
          className={`rounded-full w-full h-full border-2 ${
            self && "!border-gray-300"
          } border-red-500 p-[2px] object-contain cursor-pointer hover:scale-110 transition-all duration-200 ease-out`}
        />
        {self && (
          <BsPlusCircle
            size={20}
            className="text-gray-100 absolute top-0 right-0 bg-gray-400 rounded-full "
          ></BsPlusCircle>
        )}
      </div>
      <h2 className="text-xs w-16 text-center">{username.slice(0, 10)}... </h2>
    </div>
  );
};

export default Story;

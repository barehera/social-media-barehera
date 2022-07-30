import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="flex items-center gap-2  animate-pulse">
      <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
      <div className="flex flex-col gap-2">
        <div className="w-24 h-1 bg-gray-300 rounded-2xl"></div>
        <div className="w-20 h-1 bg-gray-300 rounded-2xl"></div>
        <div className="w-32 h-1 bg-gray-300 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;

import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="flex items-center animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="w-20 h-3 bg-gray-300 rounded-2xl"></div>
        <div className="w-32 h-3 bg-gray-300 rounded-2xl"></div>
      </div>
      <div className="w-12 h-3 bg-gray-300 rounded-2xl"></div>
    </div>
  );
};

export default SkeletonLoader;

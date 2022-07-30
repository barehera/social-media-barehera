import React from "react";

const HeaderPlaceholder = () => {
  return (
    <div className="flex items-center gap-x-12 w-full p-4 border-b border-gray-300 ">
      <div className="w-24 h-24 bg-gray-300 rounded-full "></div>
      <div className="flex flex-col justify-between items-start h-16">
        <div className="w-32 sm:w-72 h-3 bg-gray-300 rounded-2xl "></div>
        <div className="w-14 sm:w-40 h-3 bg-gray-300 rounded-2xl "></div>
        <div className="w-24 sm:w-60 h-3 bg-gray-300 rounded-2xl "></div>
      </div>
    </div>
  );
};

const PostsPlaceholder = () => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-5 justify-center items-center my-8 px-4">
      <div className="h-72 w-72 sm:w-full  bg-gray-300"></div>
      <div className="h-72 w-72 sm:w-full  bg-gray-300"></div>
      <div className="h-72 w-72 sm:w-full  bg-gray-300"></div>
      <div className="h-72 w-72 sm:w-full  bg-gray-300"></div>
      <div className="h-72 w-72 sm:w-full  bg-gray-300"></div>
      <div className="h-72 w-72 sm:w-full  bg-gray-300"></div>
      <div className="h-72 w-72 sm:w-full  bg-gray-300"></div>
      <div className="h-72 w-72 sm:w-full  bg-gray-300"></div>
      <div className="h-72 w-72 sm:w-full  bg-gray-300"></div>
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <HeaderPlaceholder></HeaderPlaceholder>
      <PostsPlaceholder></PostsPlaceholder>
    </div>
  );
};

export default SkeletonLoader;

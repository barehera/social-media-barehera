import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsChatDotsFill } from "react-icons/bs";

const HeaderPlaceholder = () => {
  return (
    <div className="flex items-center gap-2  border-gray-300 p-4">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="h-3 w-28 bg-gray-300 rounded-lg"></div>
    </div>
  );
};

const ImagePlaceholder = () => {
  return (
    <div className="border-y border-gray-300">
      <div className="h-[30rem] w-full bg-gray-300"></div>
    </div>
  );
};

const IconsPlaceholder = () => {
  return (
    <div className="p-4 flex items-center gap-6">
      <AiFillHeart className="text-3xl text-gray-300"></AiFillHeart>
      <BsChatDotsFill className="text-2xl text-gray-300"></BsChatDotsFill>
    </div>
  );
};

const LikeAndCommentCountPlaceholder = () => {
  return (
    <div className="px-4 mb-2 flex items-center justify-between">
      <div className="w-32 h-3 bg-gray-300 rounded-2xl"></div>
      <div className="w-12 h-3 bg-gray-300 rounded-2xl"></div>
    </div>
  );
};

const CommentsPlaceholder = () => {
  return (
    <div className="px-4 py-2 flex flex-col gap-2 items-end">
      <div className="w-full h-3 bg-gray-300 rounded-2xl mb-2"></div>
      <div className="w-full h-3 bg-gray-300 rounded-2xl mb-2"></div>
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="border animate-pulse rounded-md">
      <HeaderPlaceholder></HeaderPlaceholder>
      <ImagePlaceholder></ImagePlaceholder>
      <IconsPlaceholder></IconsPlaceholder>
      <LikeAndCommentCountPlaceholder></LikeAndCommentCountPlaceholder>
      <CommentsPlaceholder></CommentsPlaceholder>
    </div>
  );
};

export default SkeletonLoader;

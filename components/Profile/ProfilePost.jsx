import React, { useState, useEffect } from "react";
import { FaComment } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useRecoilState } from "recoil";
import {
  profilePostModalAtom,
  profileUserPost,
} from "../../atoms/profilePostModalAtom";

const ProfilePost = ({ post, id }) => {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useRecoilState(profilePostModalAtom);
  const [userPost, setUserPost] = useRecoilState(profileUserPost);

  //Comments
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );

    return unsubscribe;
  }, [db, id]);

  //Likes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db, id]);

  return (
    <div className="relative">
      <img
        src={post.data().image}
        className="w-96 h-96 md:h-80 md:w-80 object-cover"
      ></img>
      <div
        className="absolute top-0 w-full h-full bg-black bg-opacity-0 z-10 hover:bg-opacity-30 transition-all ease-out cursor-pointer"
        onClick={() => {
          setOpen(true);
          setUserPost({ id });
        }}
      >
        <div className="flex items-center justify-center h-full w-full space-x-10 opacity-0 hover:opacity-100">
          <div className="flex space-x-2 items-center">
            <AiFillHeart className="text-white" size={20}></AiFillHeart>
            <p className="text-white">{likes.length}</p>
          </div>
          <div className="flex space-x-2 items-center">
            <FaComment className="text-white" size={20}></FaComment>
            <p className="text-white">{comments.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePost;

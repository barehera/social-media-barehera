import React, { useState, useEffect } from "react";
import { FaComment } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRecoilState } from "recoil";
import {
  profilePostModalAtom,
  profileUserPost,
} from "../../atoms/profilePostModalAtom";

const ProfilePost = ({ post, userId, postId }) => {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useRecoilState(profilePostModalAtom);
  const [userPost, setUserPost] = useRecoilState(profileUserPost);

  //Comments
  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", userId, "posts", postId, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setComments([]);
          snapshot.docs.forEach(async (snap) => {
            const userId = snap.data().userId;
            const userInfoDoc = await getDoc(doc(db, "users", userId));

            setComments((comments) => [
              ...comments,
              {
                photoURL: userInfoDoc.data().photoURL,
                username: userInfoDoc.data().username,
                ...snap.data(),
                id: snap.id,
              },
            ]);
          });
        }
      );

      return unsubscribe;
    }
  }, [db, userId, postId]);

  //Likes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", userId, "posts", postId, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db, userId, postId]);

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
          setUserPost({
            postId: postId,
            userId: post.data().userId,
          });
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

import React, { useState, useEffect, useRef } from "react";
import { ChatIcon, HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useRouter } from "next/router";
import { useAuth } from "../../../../context/AuthContext";
import Comment from "./Comment";
import Image from "next/image";

const Post = ({ userId, postId, img, caption, time }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const ref = useRef(null);
  const date = new Date(time?.seconds * 1000);

  const handleMessageIconClick = () => {
    ref.current.focus();
  };

  //Getting post owners username and profile photo
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", userId), (doc) => {
      setUserInfo(doc.data());
    });
    return unsub;
  }, []);

  //Comments
  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", userId, "posts", postId, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setComments(snapshot.docs);
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

  //If liked set heart red
  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === user?.uid) !== -1);
  }, [likes]);

  //Post liking function
  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(
        doc(db, "users", userId, "posts", postId, "likes", user.uid)
      );
    } else {
      await setDoc(
        doc(db, "users", userId, "posts", postId, "likes", user.uid),
        {
          username: user.username,
        }
      );
    }
  };

  //Commenting Function
  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "users", userId, "posts", postId, "comments"), {
      comment: commentToSend,
      userId: user.uid,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className="bg-white my-7 border rounded-sm ">
      {/*Header */}
      <div className="flex items-center justify-between px-4 py-2 ">
        <div className="flex-1 flex items-center">
          {userInfo.photoURL ? (
            <>
              <Image
                src={userInfo?.photoURL}
                width={40}
                height={40}
                className="rounded-full"
                objectFit="cover"
              />
            </>
          ) : (
            <>
              <div className=" w-10 h-10 mr-3 bg-gray-300 animate-pulse rounded-full"></div>
              <div className=" w-32 h-3 bg-gray-300 animate-pulse rounded-2xl"></div>
            </>
          )}

          <p
            className="font-bold cursor-pointer ml-3"
            onClick={() => router.push(`${userInfo.username}`)}
          >
            {userInfo.username}
          </p>
        </div>
      </div>
      {/*İmage */}
      <div className="border-y">
        {img ? (
          <Image
            src={img}
            layout="responsive"
            width="100%"
            objectFit="contain"
            height="100%"
            loading="lazy"
          ></Image>
        ) : (
          <>
            <div className="w-full h-96 bg-gray-300 animate-pulse">HELLO</div>
          </>
        )}
      </div>

      {/*Buttons */}
      {user && (
        <div className="flex justify-between py-4 pr-2">
          <div className="flex items-center space-x-4 px-4">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="postButton text-red-500"
              ></HeartIconFilled>
            ) : (
              <HeartIcon onClick={likePost} className="postButton "></HeartIcon>
            )}
            <ChatIcon
              onClick={handleMessageIconClick}
              className="postButton"
            ></ChatIcon>
          </div>
        </div>
      )}

      {/*Liked */}
      <div className={`flex space-x-1 items-center ${!user && "mt-4"}`}>
        <div className="flex flex-1 items-center">
          <div className="pl-5 flex space-x-1 items-center">
            <p className="font-bold text-sm">{likes.length}</p>
            <p className="text-sm ">{likes.length === 1 ? "Like" : "Likes"}</p>
          </div>
          <div className="pl-4 flex space-x-1 items-center">
            <p className="font-bold text-sm">{comments.length}</p>
            <p className="text-sm ">
              {comments.length === 1 ? "Comment" : "Comments"}
            </p>
          </div>
        </div>

        <div className="pr-3 text-sm text-black font-light">{`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}</div>
      </div>
      {/*Caption */}
      <div className="p-5 flex gap-x-2 items-baseline">
        <span>
          <b>{userInfo.username}</b>
          {caption ? ` ${caption}` : "..."}
        </span>
      </div>
      {/*comments */}
      {comments.length > 0 && (
        <div className="ml-10 max-h-40 overflow-y-scroll scrollbar-thumb-black scrollbar-thin mb-4">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment}></Comment>
          ))}
        </div>
      )}

      {/*input box */}
      {user && (
        <form className="flex items-center p-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="border-none flex-1 focus:ring-0 outline-none"
            ref={ref}
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            onClick={sendComment}
            className="font-semibold text-blue-400 cursor-pointer mr-2"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;

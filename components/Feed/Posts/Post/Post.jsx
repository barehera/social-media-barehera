import React, { useState, useEffect } from "react";
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
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
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../../../firebase";
import Moment from "react-moment";
import { useRouter } from "next/router";

const Post = ({ userId, postId, username, userImg, img, caption, time }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const date = new Date(time?.seconds * 1000);

  //Posts
  useEffect(() => {
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
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);

  //Post liking function
  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(
        doc(db, "users", userId, "posts", postId, "likes", session.user.uid)
      );
    } else {
      await setDoc(
        doc(db, "users", userId, "posts", postId, "likes", session.user.uid),
        {
          username: session.user.username,
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
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  //Deleting Post Function

  const deletePost = async (userId, postId) => {
    if (session?.user?.uid === userId) {
      await deleteDoc(doc(db, "users", userId, "posts", postId));

      const imageRef = ref(storage, `${username}/posts/${postId}/image`);
      deleteObject(imageRef)
        .then(router.reload(window.location.pathname))
        .catch((err) => console.log(err));
    } else {
      alert("You are not user!!!!");
    }
  };

  return (
    <div className="bg-white my-7 border rounded-sm ">
      {/*Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 flex items-center">
          <img
            src={userImg}
            alt=""
            className="w-12 h-12 object-cover rounded-full border p-1 mr-3 cursor-pointer"
            onClick={() => router.push(`${username}`)}
          />
          <p
            className="font-bold cursor-pointer"
            onClick={() => router.push(`${username}`)}
          >
            {username}
          </p>
        </div>

        {session?.user?.uid === userId && (
          <div className="relative flex items-center">
            {deleteModalOpen && (
              <div className="absolute  right-6 p-2 bg-white shadow-md rounded">
                <button
                  className="truncate text-blue-400 text-sm"
                  onClick={() => deletePost(userId, postId)}
                >
                  Delete Post
                </button>
              </div>
            )}
            <DotsHorizontalIcon
              className="h-5 cursor-pointer"
              onClick={() => setDeleteModalOpen(!deleteModalOpen)}
            ></DotsHorizontalIcon>
          </div>
        )}
      </div>
      {/*İmage */}

      <img src={img} alt="Post image" className="object-cover w-full" />

      {/*Buttons */}
      {session && (
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

            <ChatIcon className="postButton"></ChatIcon>
            <PaperAirplaneIcon className="postButton rotate-45"></PaperAirplaneIcon>
          </div>
          <BookmarkIcon className="postButton"></BookmarkIcon>
        </div>
      )}

      {/*Liked */}
      <div className={`flex space-x-1 items-center ${!session && "mt-4"}`}>
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
          <b>{username}</b> {caption}
        </span>
      </div>
      {/*coments */}
      {comments.length > 0 && (
        <div className="ml-10 max-h-40 overflow-y-scroll scrollbar-thumb-black scrollbar-thin mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-2 mb-3">
              <img
                src={comment.data().userImage}
                alt=""
                className="h-7 w-7 rounded-full"
              />
              <div className="text-sm flex-1 flex items-baseline  space-x-2">
                <h6>
                  <b>{comment.data().username}</b> {comment.data().comment}
                </h6>
              </div>

              <Moment
                interval={1000}
                className="pr-5 text-xs text-gray-500"
                fromNow
              >
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}
      {/*input box */}
      {session && (
        <form className="flex items-center p-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="border-none flex-1 focus:ring-0 outline-none"
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

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { TbDots, TbMoodHappy } from "react-icons/tb";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import {
  profilePostModalAtom,
  profileUserPost,
} from "../atoms/profilePostModalAtom";
import { db } from "../firebase";

const ProfilePostModal = ({ id }) => {
  const router = useRouter();

  const [open, setOpen] = useRecoilState(profilePostModalAtom);
  const [userPost, setUserPost] = useRecoilState(profileUserPost);
  const [post, setPost] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession();

  //getting user posts from firestore
  // BUG!! -- Need to order by timestamp by desc...
  useEffect(() => {
    if (userPost.id) {
      const getUserPosts = async () => {
        const docRef = doc(db, "posts", userPost.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
        }
      };

      getUserPosts();
    }
  }, [userPost.id]);
  //Comments
  useEffect(() => {
    if (userPost.id) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "posts", userPost.id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setComments(snapshot.docs);
        }
      );
      return unsubscribe;
    }
  }, [db, userPost.id]);

  //Likes
  useEffect(() => {
    if (userPost.id) {
      const unsubscribe = onSnapshot(
        collection(db, "posts", userPost.id, "likes"),
        (snapshot) => {
          setLikes(snapshot.docs);
        }
      );
      return unsubscribe;
    }
  }, [db, userPost.id]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);
  const sendComment = async (e) => {
    {
      e.preventDefault();
      const commentToSend = comment;
      setComment("");

      await addDoc(collection(db, "posts", userPost.id, "comments"), {
        comment: commentToSend,
        username: session.user.username,
        userImage: session.user.image,
        timestamp: serverTimestamp(),
      });
    }
  };

  //Post liking function
  const likePost = async () => {
    if (session) {
      if (hasLiked) {
        await deleteDoc(
          doc(db, "posts", userPost.id, "likes", session.user.uid)
        );
      } else {
        await setDoc(doc(db, "posts", userPost.id, "likes", session.user.uid), {
          username: session?.user.username,
        });
      }
    } else {
      alert("Giriş Yapınız!");
      router.push("/auth/signin");
    }
  };

  return (
    <>
      {open && (
        <div className="h-screen w-full z-50 fixed top-0 flex items-center justify-center bg-opacity-70 bg-black ">
          <div className="bg-white rounded-lg w-5/6 h-5/6 flex flex-col lg:flex-row ">
            {/*Left side */}
            <div className="flex h-80 w-full lg:h-full lg:w-3/5 items-start justify-start bg-black">
              <img
                src={post.image}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
            {/*Right side */}
            <div className="w-full h-full lg:w-2/5 relative ">
              {/*user image and username */}
              <div className="flex p-4 justify-between items-center border-b border-gray-300 lg:border-none">
                <div className="flex items-center space-x-4 ">
                  <img
                    src={post.profileImg}
                    alt="user photo"
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="text-sm font-semibold">{post.username}</p>
                </div>
                <p>
                  <TbDots size={20} className="cursor-pointer"></TbDots>
                </p>
              </div>
              {/*Comments */}
              <div className="py-5 border-y border-gray-300 h-80 hidden lg:flex">
                {comments.length > 0 && (
                  <div className="ml-10 max-h-72 overflow-y-scroll scrollbar-thumb-black scrollbar-thin  flex flex-col gap-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.data().id}
                        className="flex items-start space-x-2 mb-3"
                      >
                        <img
                          src={comment.data().userImage}
                          alt=""
                          className="h-7 w-7 rounded-full"
                        />

                        <div className="text-sm flex-1 flex items-baseline  space-x-2">
                          <h6>
                            <b>{comment.data().username}</b>{" "}
                            {comment.data().comment}
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
              </div>

              {/*Like comment send icons section */}
              <div className="flex space-x-4 p-4 items-center">
                {hasLiked ? (
                  <AiFillHeart
                    size={28}
                    onClick={likePost}
                    className="postButton text-red-500"
                  ></AiFillHeart>
                ) : (
                  <AiOutlineHeart
                    size={28}
                    onClick={likePost}
                    className="postButton"
                  ></AiOutlineHeart>
                )}

                <FaRegComment size={24} className="postButton"></FaRegComment>
                <FiSend size={24} className="postButton"></FiSend>
              </div>

              {/*Likes and date */}
              <div className="px-4 flex flex-col">
                <p className="font-semibold">{likes.length} Likes</p>
                <Moment
                  interval={1000}
                  className="pr-5 text-xs text-gray-500"
                  fromNow
                >
                  {post.timestamp?.toDate()}
                </Moment>
              </div>

              {/*input box */}
              <div className="absolute w-full bottom-0">
                {session && (
                  <form className="flex items-center p-4">
                    <TbMoodHappy className="postButton" size={24}></TbMoodHappy>
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
                      className="font-semibold text-blue-400 cursor-pointer"
                    >
                      Post
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
          {/*Close icon Absolute */}
          <div className="absolute top-5 right-5 cursor-pointer">
            <AiOutlineClose
              size={20}
              className="text-white"
              onClick={() => {
                setOpen(false);
                setUserPost(null);
              }}
            ></AiOutlineClose>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePostModal;

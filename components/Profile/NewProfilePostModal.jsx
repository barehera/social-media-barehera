import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
import { useRouter } from "next/router";
import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { TbDots } from "react-icons/tb";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import {
  profilePostModalAtom,
  profileUserPost,
} from "../../atoms/profilePostModalAtom";
import { db, storage } from "../../firebase";
import { ref, deleteObject } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";

const NewProfilePostModal = () => {
  const cancelButtonRef = useRef(null);

  //OLD PROFILE POST
  const router = useRouter();
  const [open, setOpen] = useRecoilState(profilePostModalAtom);
  const [userPost, setUserPost] = useRecoilState(profileUserPost);
  const [post, setPost] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { user } = useAuth();

  //getting user posts from firestore
  useEffect(() => {
    if (userPost.postId) {
      const getUserPosts = async () => {
        const docRef = doc(
          db,
          "users",
          userPost.userId,
          "posts",
          userPost.postId
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data());
        }
      };

      getUserPosts();
    }
  }, [userPost]);

  //Comments
  useEffect(() => {
    if (userPost.postId) {
      const unsubscribe = onSnapshot(
        query(
          collection(
            db,
            "users",
            userPost.userId,
            "posts",
            userPost.postId,
            "comments"
          ),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setComments(snapshot.docs);
        }
      );
      return unsubscribe;
    }
  }, [db, userPost]);

  //Likes
  useEffect(() => {
    if (userPost.postId) {
      const unsubscribe = onSnapshot(
        collection(
          db,
          "users",
          userPost.userId,
          "posts",
          userPost.postId,
          "likes"
        ),
        (snapshot) => {
          setLikes(snapshot.docs);
        }
      );
      return unsubscribe;
    }
  }, [db, userPost]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === user?.uid) !== -1);
  }, [likes]);

  const sendComment = async (e) => {
    {
      e.preventDefault();
      const commentToSend = comment;
      setComment("");

      await addDoc(
        collection(
          db,
          "users",
          userPost.userId,
          "posts",
          userPost.postId,
          "comments"
        ),
        {
          comment: commentToSend,
          username: user.username,
          userImage: user.photoURL,
          timestamp: serverTimestamp(),
        }
      );
    }
  };

  //Post liking function
  const likePost = async () => {
    if (user) {
      if (hasLiked) {
        await deleteDoc(
          doc(
            db,
            "users",
            userPost.userId,
            "posts",
            userPost.postId,
            "likes",
            user.uid
          )
        );
      } else {
        await setDoc(
          doc(
            db,
            "users",
            userPost.userId,
            "posts",
            userPost.postId,
            "likes",
            user.uid
          ),
          {
            username: user?.username,
          }
        );
      }
    }
  };

  //Deleting Post Function

  const deletePost = async (userId, postId) => {
    if (user?.uid === userId) {
      await deleteDoc(doc(db, "users", userId, "posts", postId));
      const imageRef = ref(storage, `${user.username}/posts/${postId}/image`);
      deleteObject(imageRef)
        .then(router.reload(window.location.pathname))
        .catch((err) => console.log(err));
    } else {
      alert("You are not user!!!!");
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={() => {
          setOpen(false);
          setUserPost({ postId: null, userId: null });
          setTimeout(() => {
            setPost([]);
            setLikes([]);
            setComments([]);
            setComment("");
          }, 200);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-700 bg-opacity-80 transition-opacity" />
        </Transition.Child>

        <div className="fixed w-full  z-10 inset-0 overflow-y-auto">
          <div className="flex justify-center max-h-full p-4 sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative  !max-w-5xl mx-4 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div className="bg-white rounded-lg overflow-y-scroll scrollbar-none w-full h-full flex flex-col lg:flex-row ">
                  {/*Left side */}
                  <div className="flex h-96 w-full lg:h-full lg:w-3/5 items-start justify-start bg-black">
                    <img
                      src={post.image}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {/*Right side */}
                  <div className="w-full h-full lg:w-2/5 relative flex flex-col">
                    {/*user image and username */}
                    <div className="flex p-4 justify-between items-center lg:border-none">
                      <div className="flex items-center space-x-4 ">
                        <img
                          src={post.photoURL}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <p className="text-sm font-semibold">{post.username}</p>
                      </div>
                      {user?.uid === userPost.userId && (
                        <div className="relative flex items-center">
                          {deleteModalOpen && (
                            <div className="absolute  right-6 p-2 bg-white shadow-md rounded">
                              <button
                                className="truncate text-blue-400 text-sm"
                                onClick={() =>
                                  deletePost(userPost.userId, userPost.postId)
                                }
                              >
                                Delete Post
                              </button>
                            </div>
                          )}
                          <TbDots
                            className="h-5 cursor-pointer"
                            onClick={() => setDeleteModalOpen(!deleteModalOpen)}
                          ></TbDots>
                        </div>
                      )}
                    </div>
                    {/*Comments */}
                    <div className="py-5 border-y border-gray-300 lg:h-72">
                      {comments.length > 0 ? (
                        <div className="ml-10 max-h-48 lg:max-h-60 overflow-y-scroll scrollbar-thumb-gray-300 scrollbar-thin  flex flex-col gap-y-4">
                          {comments.map((comment) => (
                            <div
                              key={comment.id}
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
                      ) : (
                        <div className="w-full text-sm font-normal flex items-start justify-start px-5">
                          Yorum yapan ilk kisi olun...
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

                      <FaRegComment
                        size={24}
                        className="postButton"
                      ></FaRegComment>
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
                    <div>
                      {user && (
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
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div
              className="absolute top-2 right-2 lg:top-4 lg:right-4 text-white cursor-pointer text-lg"
              ref={cancelButtonRef}
            >
              <AiOutlineClose
                onClick={() => setOpen(false)}
                size={20}
              ></AiOutlineClose>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default NewProfilePostModal;

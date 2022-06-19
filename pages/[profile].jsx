import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { IoMdGrid } from "react-icons/io";
import { AiOutlineFlag } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import Modal from "../components/NewPostModal/Modal";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";
import ProfilePost from "../components/Profile/ProfilePost";
import ProfilePostModal from "../components/Profile/ProfilePostModal";
import { useRecoilState } from "recoil";
import { profileUserPost } from "../atoms/profilePostModalAtom";

const Profile = () => {
  //Router
  const router = useRouter();
  const profile = router.query.profile;
  const { data: session } = useSession();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [userPost] = useRecoilState(profileUserPost);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [follows, setFollows] = useState([]);
  const [followers, setFollowers] = useState([]);

  const [userFollows, setUserFollows] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);

  useEffect(() => {
    // getting user from firestore
    const getUser = async () => {
      if (profile) {
        const q = query(
          collection(db, "users"),
          where("username", "==", `${profile}`)
        );
        const querySnapshot = await getDocs(q);
        // Setting User
        let user = querySnapshot?.docs[0].data();
        let userId = querySnapshot?.docs[0].id;
        setUser({ ...user, id: userId });
        // Setting User Follows and Followers
        //Follows
        const unsubscribeFollows = onSnapshot(
          query(
            collection(db, "users", userId, "follows"),
            where("username", "!=", null)
          ),
          (snapshot) => {
            setUserFollows(snapshot.docs);
          }
        );
        //Followers
        const unsubscribeFollowers = onSnapshot(
          query(
            collection(db, "users", userId, "followers"),
            where("username", "!=", null)
          ),
          (snapshot) => {
            setUserFollowers(snapshot.docs);
          }
        );
        //If Followed Get Posts from firestore

        const unsubscribePosts = onSnapshot(
          query(
            collection(db, "users", userId, "posts"),
            orderBy("timestamp", "desc")
          ),
          (snapshot) => {
            setPosts(snapshot.docs);
            setLoading(false);
          }
        );

        setLoading(false);
        return unsubscribeFollowers, unsubscribeFollows, unsubscribePosts;
      }
    };
    setLoading(true);
    getUser();
  }, [profile, hasFollowed, session?.user?.uid]);

  //Getting Follows from firestore -- session user
  useEffect(() => {
    if (session) {
      const unsubscribe = onSnapshot(
        collection(db, "users", session.user.uid, "follows"),
        (snapshot) => {
          setFollows(snapshot.docs);
        }
      );
      return unsubscribe;
    }
  }, [db, session?.user?.uid]);

  //Getting Followers from firestore -- session user
  useEffect(() => {
    if (session) {
      const unsubscribe = onSnapshot(
        collection(db, "users", session.user.uid, "followers"),
        (snapshot) => {
          setFollowers(snapshot.docs);
        }
      );
      return unsubscribe;
    }
  }, [db, session?.user?.uid]);

  //Follow Unfollow Function
  const handleFollow = async () => {
    setFollowLoading(true);
    if (hasFollowed) {
      //Deleting followed user and follower session user
      await deleteDoc(doc(db, "users", session.user.uid, "follows", user.id));
      await deleteDoc(doc(db, "users", user.id, "followers", session.user.uid));
    } else {
      //Setting followed user and follower session user
      await setDoc(doc(db, "users", session.user.uid, "follows", user.id), {
        username: user.username,
        profileImg: user.profileImg,
      });
      await setDoc(doc(db, "users", user.id, "followers", session.user.uid), {
        username: session.user.username,
        profileImg: session.user.image,
      });
    }
    setFollowLoading(false);
  };

  //HasFollowed ? function
  useEffect(() => {
    setHasFollowed(follows.findIndex((follow) => follow.id === user.id) !== -1);
  }, [follows, session?.user?.uid, user]);

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <FaSpinner size={40} className="animate-spin"></FaSpinner>
        </div>
      ) : (
        <div className="relative">
          <Header></Header>
          <div className="md:max-w-5xl mx-auto flex flex-col">
            {/*Profile image and info */}
            <div className="flex items-center gap-x-12 w-full p-4 ">
              <img
                src={user?.profileImg}
                alt=""
                className="w-20 h-20 rounded-full"
              />
              <div className="flex flex-col gap-y-6 flex-1">
                {/*username and edit profile button */}
                <div className="flex flex-col md:flex-row items-start gap-x-4 md:items-center gap-y-2">
                  <h4 className="text-lg font-light">{user?.username}</h4>
                  {session?.user?.username == user.username && (
                    <button
                      className="text-sm border rounded-sm border-gray-300 py-1 px-4 font-semibold md:w-36 "
                      onClick={() => alert("work in progress!")}
                    >
                      Edit Profile
                    </button>
                  )}
                  {session && (
                    <>
                      {session?.user?.username !== profile && (
                        <div>
                          {!hasFollowed ? (
                            <button
                              onClick={handleFollow}
                              className="bg-blue-500 text-white py-1 px-4 text-sm rounded-sm hover:bg-opacity-90 transition-all"
                            >
                              Follow
                            </button>
                          ) : (
                            <button
                              onClick={handleFollow}
                              className="bg-blue-500 text-white py-1 px-4 text-sm rounded-sm hover:bg-opacity-90 transition-all"
                            >
                              Unfollow
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/*Follows-Follower number */}
                {followLoading ? (
                  <div className="gap-x-6 hidden md:flex">
                    <FaSpinner size={20} className="animate-spin"></FaSpinner>
                  </div>
                ) : (
                  <div className="gap-x-6 hidden md:flex">
                    <div className="flex gap-x-1 items-center">
                      <p className="font-semibold">{posts.length}</p>
                      <p className="text-sm">Post</p>
                    </div>
                    <div className="flex gap-x-1 items-center relative group">
                      <p className="font-semibold">{userFollowers.length}</p>
                      <p className="text-sm">Follower</p>
                      {/*Followers show modal */}
                      <div className="bg-white p-4 shadow-lg rounded w-40 absolute top-6 hidden group-hover:flex flex-col z-50 space-y-2">
                        {userFollowers.length > 0 ? (
                          <>
                            {userFollowers.map((follower) => (
                              <div
                                className="flex space-x-2 w-full cursor-pointer hover:scale-110"
                                key={follower.id}
                                onClick={() =>
                                  router.push(`/${follower.data().username}`)
                                }
                              >
                                <img
                                  src={follower.data().profileImg}
                                  alt=""
                                  className="h-5 w-5 rounded-full"
                                />
                                <p className="text-xs">
                                  {follower.data().username}
                                </p>
                              </div>
                            ))}
                          </>
                        ) : (
                          <p className="text-sm font-semibold">No Followers</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-x-1 items-center relative group">
                      <p className="font-semibold">{userFollows.length}</p>
                      <p className="text-sm">Follows</p>
                      {/*Follows show modal */}

                      <div className="bg-white p-4 shadow-lg rounded w-40 absolute top-6 hidden group-hover:flex flex-col z-50 space-y-2">
                        {userFollows.length > 0 ? (
                          <>
                            {userFollows.map((follow) => (
                              <div
                                className="flex space-x-2 w-full cursor-pointer hover:scale-110"
                                key={follow.id}
                                onClick={() =>
                                  router.push(`/${follow.data().username}`)
                                }
                              >
                                <img
                                  src={follow.data().profileImg}
                                  alt=""
                                  className="h-5 w-5 rounded-full"
                                />
                                <p className="text-xs">
                                  {follow.data().username}
                                </p>
                              </div>
                            ))}
                          </>
                        ) : (
                          <p className="text-sm font-semibold">No Follows</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/*Name section */}
                <div className="hidden">
                  <p className="font-semibold">TEST</p>
                </div>
              </div>
            </div>

            {/*Follows-Follower number -- MOBILE */}
            {followLoading ? (
              <div className="md:hidden flex items-center px-6 justify-around  border-y border-gray-300 w-full py-4">
                <FaSpinner size={30} className="animate-spin"></FaSpinner>
              </div>
            ) : (
              <div className="md:hidden flex items-center px-6 justify-around  border-y border-gray-300 w-full py-4">
                <div className="flex flex-col items-center">
                  <p className="font-semibold text-sm">{posts.length}</p>
                  <p className="text-sm text-gray-500">Post</p>
                </div>
                <div className="flex flex-col items-center relative group">
                  <p className="font-semibold text-sm">
                    {userFollowers.length}
                  </p>
                  <p className="text-sm text-gray-500">Follower</p>
                  {/*Followers show modal */}
                  <div className="bg-white p-4 shadow-lg rounded w-40 absolute top-6 hidden group-hover:flex flex-col z-50 space-y-2">
                    {userFollowers.length > 0 ? (
                      <>
                        {userFollowers.map((follower) => (
                          <div
                            className="flex space-x-2 w-full cursor-pointer hover:scale-110"
                            key={follower.id}
                            onClick={() =>
                              router.push(`/${follower.data().username}`)
                            }
                          >
                            <img
                              src={follower.data().profileImg}
                              alt=""
                              className="h-5 w-5 rounded-full"
                            />
                            <p className="text-xs">
                              {follower.data().username}
                            </p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-sm font-semibold">No Followers</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center relative group">
                  <p className="font-semibold text-sm">{userFollows.length}</p>
                  <p className="text-sm text-gray-500">Follows</p>
                  <div className="bg-white p-4 shadow-lg rounded w-40 absolute top-6 hidden group-hover:flex flex-col z-50 space-y-2">
                    {userFollows.length > 0 ? (
                      <>
                        {userFollows.map((follow) => (
                          <div
                            className="flex space-x-2 w-full cursor-pointer hover:scale-110"
                            key={follow.id}
                            onClick={() =>
                              router.push(`/${follow.data().username}`)
                            }
                          >
                            <img
                              src={follow.data().profileImg}
                              alt=""
                              className="h-5 w-5 rounded-full"
                            />
                            <p className="text-xs">{follow.data().username}</p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-sm font-semibold">No Follows</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/*Icons */}
            <div className=" flex items-center px-6 justify-around md:justify-center py-3 border-b md:border-b-0 md:border-t border-gray-300 w-full text-gray-500 md:gap-x-4">
              <div className="md:p-2 md:rounded-lg md:flex md:items-center md:gap-x-1 cursor-pointer  hover:bg-gray-100 transition-all">
                <IoMdGrid className="text-blue-400 " size={24}></IoMdGrid>
                <p className="hidden md:flex">Gönderiler</p>
              </div>
              <div
                className="md:p-2 md:rounded-lg md:flex md:items-center  md:gap-x-2 cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => alert("work in progress!")}
              >
                <AiOutlineFlag size={24}></AiOutlineFlag>
                <p className="hidden md:flex">Kaydedilenler</p>
              </div>
              <div
                className="md:p-2 md:rounded-lg md:flex md:items-center  md:gap-x-2 cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => alert("work in progress!")}
              >
                <HiOutlineUserGroup size={24}></HiOutlineUserGroup>
                <p className="hidden md:flex">Etiketlenenler</p>
              </div>
            </div>
            {/*Posts*/}
            {session ? (
              <div>
                {session?.user?.uid === user.id ? (
                  <div>
                    {posts.length > 0 ? (
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-5 justify-center items-center my-8 px-4">
                        {posts.map((post) => (
                          <ProfilePost
                            key={post.id}
                            userId={post.data().userId}
                            postId={post.id}
                            post={post}
                          ></ProfilePost>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center h-40 mx-auto">
                          <div className="w-full flex flex-col items-center justify-center px-6">
                            <h4 className="font-semibold text-center mb-2">
                              Hayatından kareleri çekip paylaşmaya başla.
                            </h4>
                            <p className="text-sm text-center ">
                              ilk fotoğrafını paylasmak icin + butonuna tıkla
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <img
                            src="https://embedsocial.com/wp-content/uploads/2020/10/add-links-instagram-posts.jpg"
                            alt="picture"
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {hasFollowed ? (
                      <div>
                        {posts.length > 0 ? (
                          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-5 justify-center items-center my-8 px-4">
                            {posts.map((post) => (
                              <ProfilePost
                                key={post.id}
                                userId={post.data().userId}
                                postId={post.id}
                                post={post}
                              ></ProfilePost>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-40 mx-auto">
                            <div className="w-full flex flex-col items-center justify-center px-6">
                              <h4 className="text-center mb-2 text-gray-500">
                                <b className="px-1 text-black">
                                  {user.username}
                                </b>
                                has no posts at the moment...
                              </h4>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center text-gray-500 text-center">
                        You have to follow
                        <b className="px-1 text-black">{user.username}</b>to see
                        posts...
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-40 flex flex-col items-center justify-center text-gray-500 gap-y-3">
                <p>
                  You have to be signed in to see
                  <b className="px-1 text-black">{user.username}</b>posts...
                </p>
                <button
                  className="p-2 bg-blue-500 text-white rounded-sm w-24"
                  onClick={() => router.push("/auth/signin")}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
          <Modal></Modal>
          {userPost && <ProfilePostModal></ProfilePostModal>}
        </div>
      )}
    </>
  );
};

export default Profile;

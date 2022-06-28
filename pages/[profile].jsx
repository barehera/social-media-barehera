import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlineLock } from "react-icons/ai";
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
import ProfilePost from "../components/Profile/ProfilePost";
import NewProfilePostModal from "../components/Profile/NewProfilePostModal";
import { useAuth } from "../context/AuthContext";
import FollowFollowerUser from "../components/Profile/FollowFollowerUser/FollowFollowerUser";
import Image from "next/image";

const Profile = () => {
  //Router
  const router = useRouter();
  const profile = router.query.profile;

  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [follows, setFollows] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userExists, setUserExists] = useState(true);
  const [userFollows, setUserFollows] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);

  useEffect(() => {
    // getting profileUser from firestore
    const getUser = async () => {
      if (profile) {
        const q = query(
          collection(db, "users"),
          where("username", "==", `${profile}`)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
          setUserExists(true);
          // Setting profileUser
          const profileUser = querySnapshot?.docs[0].data();
          const profileUserId = querySnapshot?.docs[0].id;
          setProfileUser({ ...profileUser, id: profileUserId });
          // Setting profileUser Follows and Followers
          //Follows
          const unsubscribeFollows = onSnapshot(
            query(
              collection(db, "users", profileUserId, "follows"),
              where("username", "!=", null)
            ),
            (snapshot) => {
              setUserFollows(snapshot.docs);
              setLoading(false);
            }
          );
          //Followers
          const unsubscribeFollowers = onSnapshot(
            query(
              collection(db, "users", profileUserId, "followers"),
              where("username", "!=", null)
            ),
            (snapshot) => {
              setUserFollowers(snapshot.docs);
              setLoading(false);
            }
          );
          //If Followed Get Posts from firestore

          const unsubscribePosts = onSnapshot(
            query(
              collection(db, "users", profileUserId, "posts"),
              orderBy("timestamp", "desc")
            ),
            (snapshot) => {
              setPosts(snapshot.docs);
              setLoading(false);
            }
          );

          return unsubscribeFollowers, unsubscribeFollows, unsubscribePosts;
        } else {
          setUserExists(false);
        }
      }
    };
    setLoading(true);
    getUser();
  }, [profile, hasFollowed, user]);

  //Getting Follows from firestore -- session user
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        collection(db, "users", user.uid, "follows"),
        (snapshot) => {
          setFollows(snapshot.docs);
        }
      );
      return unsubscribe;
    }
  }, [db, user]);

  //Getting Followers from firestore -- session user
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        collection(db, "users", user.uid, "followers"),
        (snapshot) => {
          setFollowers(snapshot.docs);
        }
      );
      return unsubscribe;
    }
  }, [db, user]);

  //Follow Unfollow Function
  const handleFollow = async () => {
    if (hasFollowed) {
      //Deleting followed user and follower session user
      await deleteDoc(doc(db, "users", user.uid, "follows", profileUser.id));
      await deleteDoc(doc(db, "users", profileUser.id, "followers", user.uid));
    } else {
      //Setting followed user and follower session user
      await setDoc(doc(db, "users", user.uid, "follows", profileUser.id), {
        userId: profileUser.id,
        username: profileUser.username,
      });
      await setDoc(doc(db, "users", profileUser.id, "followers", user.uid), {
        userId: user.uid,
        username: user.username,
      });
    }
  };

  //HasFollowed ? function
  useEffect(() => {
    setHasFollowed(
      follows.findIndex((follow) => follow.id === profileUser.id) !== -1
    );
  }, [follows, user, profileUser]);

  return (
    <>
      {userExists ? (
        <>
          {loading ? (
            <div className="w-full h-screen flex items-center justify-center">
              <FaSpinner size={40} className="animate-spin"></FaSpinner>
            </div>
          ) : (
            <div className="relative">
              <div className="md:max-w-5xl mx-auto flex flex-col">
                {/*Profile image and info */}
                <div className="flex items-center gap-x-12 w-full p-4 ">
                  <Image
                    src={profileUser?.photoURL}
                    width={100}
                    height={100}
                    className="rounded-full"
                    objectFit="cover"
                  />

                  <div className="flex flex-col gap-y-2 flex-1">
                    {/*username and edit profile button */}
                    <div className="flex flex-col md:flex-row items-start gap-x-4 md:items-center gap-y-2">
                      <h4 className="text-lg font-light">
                        {profileUser?.username}
                        {profileUser.age && "-" + profileUser.age}{" "}
                        {profileUser.displayName &&
                          `(${profileUser.displayName})`}
                      </h4>
                      {user.username == profileUser.username && (
                        <button
                          className="text-sm border rounded-sm border-gray-300 py-1 px-4 font-semibold md:w-36 "
                          onClick={() => router.push("/edit")}
                        >
                          Edit Profile
                        </button>
                      )}
                      {user && (
                        <>
                          {user?.username !== profile && (
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
                    {/*Bio */}
                    <div>
                      <p className="text-sm">{profileUser.bio}</p>
                    </div>
                    {/*Follows-Follower number */}

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
                                <FollowFollowerUser
                                  key={follower.id}
                                  follower={follower}
                                ></FollowFollowerUser>
                              ))}
                            </>
                          ) : (
                            <p className="text-sm font-semibold">
                              No Followers
                            </p>
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
                                <FollowFollowerUser
                                  key={follow.id}
                                  follower={follow}
                                ></FollowFollowerUser>
                              ))}
                            </>
                          ) : (
                            <p className="text-sm font-semibold">No Follows</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/*Follows-Follower number -- MOBILE */}

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
                            <FollowFollowerUser
                              key={follower.id}
                              follower={follower}
                            ></FollowFollowerUser>
                          ))}
                        </>
                      ) : (
                        <p className="text-sm font-semibold">No Followers</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center relative group">
                    <p className="font-semibold text-sm">
                      {userFollows.length}
                    </p>
                    <p className="text-sm text-gray-500">Follows</p>
                    <div className="bg-white p-4 shadow-lg rounded w-40 absolute top-6 hidden group-hover:flex flex-col z-50 space-y-2">
                      {userFollows.length > 0 ? (
                        <>
                          {userFollows.map((follow) => (
                            <FollowFollowerUser
                              key={follow.id}
                              follower={follow}
                            ></FollowFollowerUser>
                          ))}
                        </>
                      ) : (
                        <p className="text-sm font-semibold">No Follows</p>
                      )}
                    </div>
                  </div>
                </div>

                {/*Posts*/}
                <div className="border-t border-gray-300">
                  {user ? (
                    <div>
                      {user?.uid === profileUser.id ? (
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
                                    ilk fotoğrafını paylasmak icin + butonuna
                                    tıkla
                                  </p>
                                </div>
                              </div>
                              <div className="relative h-96 w-full flex items-center justify-center">
                                <Image
                                  src="https://embedsocial.com/wp-content/uploads/2020/10/add-links-instagram-posts.jpg"
                                  layout="fill"
                                  objectFit="contain"
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
                                      <b className="px-1 text-black text-center">
                                        {profileUser.username}
                                      </b>
                                      has no posts at the moment...
                                    </h4>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full mt-10 flex flex-col items-center h-40">
                              <AiOutlineLock
                                size={124}
                                className="text-gray-200"
                              ></AiOutlineLock>
                              <div className=" flex items-center justify-center text-gray-500 text-center">
                                Follow
                                <b className="px-1 text-black">
                                  {profileUser.username}
                                </b>
                                to see posts...
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-40 flex flex-col items-center justify-center text-gray-500 gap-y-3 text-center">
                      <p>
                        Login to see
                        <b className="px-1 text-black">
                          {profileUser.username}
                        </b>
                        posts...
                      </p>
                      <button
                        className="p-2 bg-blue-500 text-white rounded-sm w-24"
                        onClick={() => router.push("/login")}
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Modal></Modal>
              <NewProfilePostModal></NewProfilePostModal>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          {/*If user doesnt exist error message */}
          NO USER NAMED <p className="mx-1 uppercase font-bold">{profile}</p> IN
          DATABASE...
        </div>
      )}
    </>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { IoMdGrid } from "react-icons/io";
import { AiOutlineFlag } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import Modal from "../components/Modal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";

const Profile = () => {
  //Router
  const router = useRouter();
  const { profile } = router.query;
  const { data: session } = useSession();

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // getting user from firestore
    const getUser = async () => {
      const q = query(
        collection(db, "users"),
        where("username", "==", `${profile}`)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        setLoading(false);
      });
    };
    //getting user posts from firestore
    const getUserPosts = async () => {
      const q = query(
        collection(db, "posts"),
        where("username", "==", `${profile}`)
      );
      await getDocs(q).then((snapshot) => setPosts(snapshot.docs));
    };
    setLoading(true);
    getUser();
    setLoading(true);
    getUserPosts();
  }, [profile]);

  return (
    <div>
      <Header></Header>
      <div className="md:max-w-5xl mx-auto flex flex-col  ">
        {/*Profile image and info */}
        <div className="flex items-center gap-x-12 w-full p-4 ">
          {loading ? (
            <div className="w-20 h-20 flex justify-center items-center">
              <FaSpinner className="animate-spin"></FaSpinner>
            </div>
          ) : (
            <img
              src={user?.profileImg}
              alt=""
              className="w-20 h-20 rounded-full"
            />
          )}

          <div className="flex flex-col gap-y-6 flex-1">
            {/*username and edit profile button */}
            <div className="flex flex-col md:flex-row items-start gap-x-4 md:items-center gap-y-2">
              {loading ? (
                <FaSpinner className="animate-spin"></FaSpinner>
              ) : (
                <h4 className="text-lg font-light">{user?.username}</h4>
              )}
              {session?.user?.username == user.username && (
                <button className="text-sm border rounded-sm border-gray-300 py-1 px-4 font-semibold md:w-36 ">
                  Edit Profile
                </button>
              )}
            </div>
            {/*Post and follower number */}
            <div className="gap-x-6 hidden md:flex">
              <div className="flex gap-x-1 items-center">
                <p className="font-semibold">0</p>
                <p className="text-sm">Post</p>
              </div>
              <div className="flex gap-x-1 items-center">
                <p className="font-semibold">120</p>
                <p className="text-sm">Follower</p>
              </div>
              <div className="flex gap-x-1 items-center">
                <p className="font-semibold">180</p>
                <p className="text-sm">Follows</p>
              </div>
            </div>
            {/*Name section */}
            <div className="hidden">
              <p className="font-semibold">TEST</p>
            </div>
          </div>
        </div>

        {/*Post and follower number -- MOBILE */}
        <div className="md:hidden flex items-center px-6 justify-around  border-y border-gray-300 w-full py-4">
          <div className="flex flex-col items-center">
            <p className="font-semibold text-sm">0</p>
            <p className="text-sm text-gray-500">Post</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-semibold text-sm">120</p>
            <p className="text-sm text-gray-500">Follower</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-semibold text-sm">180</p>
            <p className="text-sm text-gray-500">Follows</p>
          </div>
        </div>
        {/*Icons */}
        <div className=" flex items-center px-6 justify-around md:justify-center py-3 border-b md:border-b-0 md:border-t border-gray-300 w-full text-gray-500 md:gap-x-4">
          <div className="md:p-2 md:rounded-lg md:flex md:items-center md:gap-x-1 cursor-pointer  hover:bg-gray-100 transition-all">
            <IoMdGrid className="text-blue-400 " size={24}></IoMdGrid>
            <p className="hidden md:flex">Gönderiler</p>
          </div>
          <div className="md:p-2 md:rounded-lg md:flex md:items-center  md:gap-x-2 cursor-pointer hover:bg-gray-100 transition-all">
            <AiOutlineFlag size={24}></AiOutlineFlag>
            <p className="hidden md:flex">Kaydedilenler</p>
          </div>
          <div className="md:p-2 md:rounded-lg md:flex md:items-center  md:gap-x-2 cursor-pointer hover:bg-gray-100 transition-all">
            <HiOutlineUserGroup size={24}></HiOutlineUserGroup>
            <p className="hidden md:flex">Etiketlenenler</p>
          </div>
        </div>
        {/*Posts*/}

        {posts ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-5 lg:gap-10 justify-center items-center my-10 px-4">
            {posts.map((post) => (
              <div key={post.id}>
                <img
                  src={post.data().image}
                  className="w-full h-96 md:h-80 md:w-80 object-cover"
                ></img>
              </div>
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
                  ilk fotoğrafını veya videonu paylaşmak için uygulamayı yükle.
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
      <Modal></Modal>
    </div>
  );
};

export default Profile;

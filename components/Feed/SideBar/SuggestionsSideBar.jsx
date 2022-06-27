import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

const SuggestionsSideBar = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionUserFollowsId, setSessionUserFollowsId] = useState([]);
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const getUsers = async () => {
      //Getting all users
      const q = query(
        collection(db, "users"),
        where("username", "!=", user.username)
      );
      const querySnapshot = await getDocs(q);
      setAllUsers([]);
      querySnapshot.forEach((doc) => {
        setAllUsers((allUsers) => [...allUsers, { ...doc.data(), id: doc.id }]);
      });
      setLoading(false);
      //Session user's Follows
      const unsubscribeFollows = onSnapshot(
        query(
          collection(db, "users", user.uid, "follows"),
          where("username", "!=", null)
        ),
        (snapshot) => {
          snapshot.docs.forEach((doc) => {
            setSessionUserFollowsId((sessionUserFollowsId) => [
              ...sessionUserFollowsId,
              doc.id,
            ]);
          });
        }
      );
      return unsubscribeFollows;
    };
    setLoading(true);
    getUsers();
  }, [db]);

  useEffect(() => {
    //Filtering All Users with using session users follows

    setFilteredUser([]);
    allUsers
      .filter(({ id }) => !sessionUserFollowsId.includes(id))
      .forEach((filter) => {
        setFilteredUser((filteredUser) => [...filteredUser, filter]);
      });
  }, [db, allUsers, sessionUserFollowsId]);

  //Follow Unfollow Function
  const handleFollow = async (id, username, photoURL) => {
    //Setting followed user and follower session user
    await setDoc(doc(db, "users", user.uid, "follows", id), {
      username: username,
      photoURL: photoURL,
    });
    await setDoc(doc(db, "users", id, "followers", user.uid), {
      username: user.username,
      photoURL: user.photoURL,
    });
  };

  return (
    <div>
      {loading ? (
        <div className="w-full h-80 flex items-center justify-center">
          <FaSpinner className="animate-spin" size={30}></FaSpinner>
        </div>
      ) : (
        <div className="mt-4 ">
          <div className="flex justify-between mb-4 items-center">
            <h4 className="text-gray-400">Suggestions for you</h4>
            {filteredUser.length > 5 && (
              <button
                onClick={() => router.push("/suggestions")}
                className="hover:scale-110 transition-all duration-300 ease-out"
              >
                See All
              </button>
            )}
          </div>
          {filteredUser.length > 0 ? (
            <div className="flex flex-col gap-y-4">
              {filteredUser.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center space-x-4">
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-12 h-12 object-cover rounded-full border p-1 cursor-pointer"
                    onClick={() => router.push(`${user.username}`)}
                  />
                  <div className="flex flex-col items-start flex-1">
                    <h4
                      onClick={() => router.push(`${user.username}`)}
                      className="font-bold cursor-pointer"
                    >
                      {user.username}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Wants to be your friend
                    </p>
                  </div>
                  <button
                    className="text-blue-400 hover:scale-110 transition-all duration-300 ease-out"
                    onClick={() =>
                      handleFollow(user.id, user.username, user.photoURL)
                    }
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-24 flex items-center justify-center">
              No Suggestions for you.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestionsSideBar;

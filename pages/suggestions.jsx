import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

const Suggestions = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionUserFollowsId, setSessionUserFollowsId] = useState([]);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const getUsers = async () => {
        //Getting all users
        const q = query(
          collection(db, "users"),
          where("username", "!=", user.username)
        );
        const querySnapshot = await getDocs(q);
        setAllUsers([]);
        querySnapshot.forEach((doc) => {
          setAllUsers((allUsers) => [
            ...allUsers,
            { ...doc.data(), id: doc.id },
          ]);
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
    }
  }, [db, user]);

  useEffect(() => {
    //Filtering All Users with using session users follows
    setFilteredUser([]);
    allUsers
      .filter(({ id }) => !sessionUserFollowsId.includes(id))
      .forEach((filter) => {
        setFilteredUser((filteredUser) => [...filteredUser, filter]);
      });
  }, [db, allUsers, sessionUserFollowsId]);

  const SkeletonLoader = () => {
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div className="w-32 h-2 bg-gray-300 rounded-2xl"></div>
          <div className="w-24 h-2 bg-gray-300 rounded-2xl"></div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <div className="max-w-5xl mx-auto">
          <h4 className="pb-3 my-5 text-xl text-center border-b border-gray-300 font-semibold ">
            Suggestions For You
          </h4>
          <div className="grid items-center justify-center md:grid-cols-2 lg:grid-cols-3 gap-3 animate px-4">
            <SkeletonLoader></SkeletonLoader>
            <SkeletonLoader></SkeletonLoader>
            <SkeletonLoader></SkeletonLoader>
            <SkeletonLoader></SkeletonLoader>
            <SkeletonLoader></SkeletonLoader>
            <SkeletonLoader></SkeletonLoader>
            <SkeletonLoader></SkeletonLoader>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <h4 className="pb-3 my-5 text-xl text-center border-b border-gray-300 font-semibold ">
            Suggestions For You
          </h4>
          {filteredUser.length > 0 ? (
            <div className="grid items-center justify-center md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredUser.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-4 p-2 hover:bg-gray-100 transition-all duration-200 ease-out cursor-pointer"
                  onClick={() => router.push(`${user.username}`)}
                >
                  <Image
                    src={user.photoURL}
                    width={48}
                    height={48}
                    objectFit="cover"
                    className="rounded-full"
                  />

                  <div className="flex flex-col items-start flex-1">
                    <h4 className="font-bold cursor-pointer">
                      {user.username}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Wants to be your friend
                    </p>
                  </div>
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

export default Suggestions;

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
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
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Router from "next/router";

const Suggestions = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionUserFollowsId, setSessionUserFollowsId] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const getUsers = async () => {
        //Getting all users
        const q = query(
          collection(db, "users"),
          where("username", "!=", session.user.username)
        );
        const querySnapshot = await getDocs(q);
        setAllUsers([]);
        querySnapshot.forEach((doc) => {
          setAllUsers((allUsers) => [
            ...allUsers,
            { ...doc.data(), id: doc.id },
          ]);
        });

        //Session user's Follows
        const unsubscribeFollows = onSnapshot(
          query(
            collection(db, "users", session.user.uid, "follows"),
            where("username", "!=", null)
          ),
          (snapshot) => {
            snapshot.docs.forEach((doc) => {
              setSessionUserFollowsId((sessionUserFollowsId) => [
                ...sessionUserFollowsId,
                doc.id,
              ]);
              setLoading(false);
            });
          }
        );
        return unsubscribeFollows;
      };
      setLoading(true);
      getUsers();
    }
  }, [db, session]);

  useEffect(() => {
    //Filtering All Users with using session users follows
    setFilteredUser([]);
    allUsers
      .filter(({ id }) => !sessionUserFollowsId.includes(id))
      .forEach((filter) => {
        setFilteredUser((filteredUser) => [...filteredUser, filter]);
      });
  }, [db, allUsers, sessionUserFollowsId]);

  useEffect(() => {
    if (!session) {
      Router.push("/auth/signin");
    } else {
      Router.push("/suggestions");
    }
  }, [session]);

  return (
    <div>
      <Header></Header>
      {loading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <FaSpinner size={40} className="animate-spin"></FaSpinner>
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
                  <img
                    src={user.profileImg}
                    alt=""
                    className="w-12 h-12 rounded-full border p-1 cursor-pointer"
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

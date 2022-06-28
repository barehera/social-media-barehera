import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import Post from "../Posts/Post/Post";
import { FaSpinner } from "react-icons/fa";

import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const router = useRouter();

  //Getting Followed People -- session user
  useEffect(() => {
    if (user) {
      const getPosts = async () => {
        setLoading(true);

        const unsubscribeFollowedUsers = onSnapshot(
          query(
            collection(db, "users", user.uid, "follows"),
            where("username", "!=", null)
          ),
          (followedUsers) => {
            followedUsers.docs.map(async (user) => {
              const unsubscribeFollowedUserPosts = onSnapshot(
                query(
                  collection(db, "users", user.id, "posts"),
                  orderBy("timestamp", "desc")
                ),
                (snapshot) => {
                  snapshot.docs.map((doc) => {
                    setPosts((posts) => [
                      ...posts,
                      { ...doc.data(), id: doc.id },
                    ]);
                  });

                  setLoading(false);
                }
              );

              return unsubscribeFollowedUserPosts;
            });
          }
        );

        const unsubscribeSessionUserPosts = onSnapshot(
          query(
            collection(db, "users", user.uid, "posts"),
            orderBy("timestamp", "desc")
          ),
          (snapshot) => {
            snapshot.docs.map((doc) => {
              let newPost = { ...doc.data(), id: doc.id };
              setPosts((posts) => [...posts, newPost]);
            });
            setLoading(false);
          }
        );
        return unsubscribeFollowedUsers, unsubscribeSessionUserPosts;
      };

      getPosts();
    }
  }, [db, user]);

  useEffect(() => {
    //Removes duplicate post when follows changed and sorts it
    setSortedPosts(
      posts
        .filter(
          (ele, ind) => ind === posts.findIndex((elem) => elem.id === ele.id)
        )
        .sort(
          (a, b) => b.timestamp?.seconds * 1000 - a.timestamp?.seconds * 1000
        )
    );
  }, [posts]);

  return (
    <div>
      {loading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <FaSpinner size={30} className="animate-spin"></FaSpinner>
        </div>
      ) : (
        <div className="my-8">
          {sortedPosts.length > 0 ? (
            <>
              {sortedPosts?.map((post) => (
                <Post
                  key={post.id}
                  postId={post.id}
                  userId={post.userId}
                  username={post.username}
                  userImg={post.photoURL}
                  img={post.image}
                  caption={post.caption}
                  time={post.timestamp}
                  userRef={post.userRef}
                ></Post>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-lg font-bold ">NO POSTS</h1>
              <p className="text-sm  text-gray-500">
                You can find new friends and follow them to see their posts
              </p>
              <button
                className="px-5 py-1 mt-4 text-white text-sm   bg-blue-500 rounded"
                onClick={() => router.push("/suggestions")}
              >
                Go Suggestions
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;

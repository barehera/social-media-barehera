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
import SkeletonLoader from "./SkeletonLoader";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  //Getting Followed People -- session user
  useEffect(() => {
    if (user) {
      const unsubscribeFollowedUsers = onSnapshot(
        query(
          collection(db, "users", user.uid, "follows"),
          where("username", "!=", null)
        ),
        (followedUsers) => {
          followedUsers.docs.map(async (user) => {
            setLoading(true);
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
      <div className="my-8">
        {!loading ? (
          <>
            {posts.length > 0 ? (
              <>
                {sortedPosts?.map((post) => (
                  <Post
                    key={post.id}
                    postId={post.id}
                    userId={post.userId}
                    img={post.image}
                    caption={post.caption}
                    time={post.timestamp}
                  ></Post>
                ))}
              </>
            ) : (
              <>
                <div
                  onClick={() => router.push("/suggestions")}
                  className="flex cursor-pointer gap-x-1 items-center justify-center text-center"
                >
                  <p>
                    Arkadaşlarını bulmak için <b>tıkla</b>
                  </p>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-6">
            <SkeletonLoader></SkeletonLoader>
            <SkeletonLoader></SkeletonLoader>
            <SkeletonLoader></SkeletonLoader>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;

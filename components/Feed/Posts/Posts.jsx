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
import { useSession } from "next-auth/react";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionFollows, setSessionFollows] = useState([]);
  const { data: session } = useSession();

  //Getting Followed People -- session user
  useEffect(() => {
    if (session) {
      const getPosts = async () => {
        setLoading(true);
        const unsubscribeFollowedUsers = onSnapshot(
          query(
            collection(db, "users", session.user.uid, "follows"),
            where("username", "!=", null)
          ),
          (followedUsers) => {
            setSessionFollows(followedUsers);
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
            collection(db, "users", session.user.uid, "posts"),
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
      setPosts([]);
      getPosts();
    }
  }, [db, session?.user?.uid]);

  return (
    <div>
      {loading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <FaSpinner size={30} className="animate-spin"></FaSpinner>
        </div>
      ) : (
        <div className="my-8 ">
          {posts?.map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              userId={post.userId}
              username={post.username}
              userImg={post.profileImg}
              img={post.image}
              caption={post.caption}
              time={post.timestamp}
            ></Post>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;

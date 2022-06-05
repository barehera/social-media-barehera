import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Post from "./Post";
import { FaSpinner } from "react-icons/fa";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [db]);
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
              id={post.id}
              username={post.data().username}
              userImg={post.data().profileImg}
              img={post.data().image}
              caption={post.data().caption}
            ></Post>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;

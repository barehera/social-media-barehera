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
  const [sessionUserFollowsId, setSessionUserFollowsId] = useState([]);
  const { data: session } = useSession();

  //Getting Followed People -- session user
  useEffect(() => {
    if (session) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", session.user.uid, "follows"),
          where("username", "!=", null)
        ),
        (snapshot) => {
          let docIdArray = [];
          snapshot.docs.map((doc) => {
            docIdArray.push(doc.id);
          });
          docIdArray.push(session.user.uid);
          setSessionUserFollowsId(docIdArray);
        }
      );
      return unsubscribe;
    }
  }, [db, session?.user?.uid]);

  //Session userın takip ettiği kullanıcıların ve kendi postlarını alma
  useEffect(() => {
    let postsArray = [];
    sessionUserFollowsId.forEach(async (id) => {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", id, "posts"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          snapshot.docs.map((doc) => {
            postsArray.push({ ...doc.data(), id: doc.id });
          });
          //Posts need to be sorted
          setPosts(postsArray);
        }
      );
      return unsubscribe;
    });
  }, [sessionUserFollowsId, db]);

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
            ></Post>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;

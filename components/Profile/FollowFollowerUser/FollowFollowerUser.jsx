import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/router";

const FollowFollowerUser = ({ follower }) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", follower.id), (doc) => {
      setUserInfo(doc.data());
    });
    return unsub;
  }, []);
  return (
    <div
      className="flex space-x-2 w-full cursor-pointer hover:scale-110"
      key={follower.id}
      onClick={() => router.push(`/${userInfo.username}`)}
    >
      <img
        src={userInfo.photoURL}
        alt=""
        className="h-5 w-5 rounded-full object-cover"
      />
      <p className="text-xs">{userInfo.username}</p>
    </div>
  );
};

export default FollowFollowerUser;

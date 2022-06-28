import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/router";
import Image from "next/image";

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
      {userInfo.photoURL && (
        <Image
          src={userInfo.photoURL}
          width={20}
          height={20}
          className="rounded-full"
          objectFit="cover"
        />
      )}

      <p className="text-xs">{userInfo.username}</p>
    </div>
  );
};

export default FollowFollowerUser;

import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Moment from "react-moment";
import { db } from "../../../../firebase";

const Comment = ({ comment }) => {
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUserInfo = async () => {
      const docRef = doc(db, "users", comment.data().userId);
      const docSnap = await getDoc(docRef);
      setUserInfo(docSnap.data());
      setLoading(false);
    };
    setLoading(true);
    getUserInfo();
  }, [comment]);
  return (
    <>
      <div className="flex items-start space-x-2 mb-3">
        {userInfo.photoURL && (
          <Image
            src={userInfo.photoURL}
            width={28}
            height={28}
            className="rounded-full"
            objectFit="cover"
          />
        )}

        <div className="text-sm flex-1 flex items-baseline  space-x-2">
          <h6 className="max-w-[14rem] sm:max-w-[24rem] md:max-w-[32rem] lg:max-w-[36rem] break-words">
            <b>{userInfo.username}</b> {comment.data().comment}
          </h6>
        </div>

        <Moment
          interval={1000}
          className="pr-5 text-xs text-gray-500 hidden sm:block"
          fromNow
        >
          {comment.timestamp?.toDate()}
        </Moment>
      </div>
    </>
  );
};

export default Comment;

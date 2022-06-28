import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FaSpinner } from "react-icons/fa";

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
      {loading ? (
        <div className="flex items-start space-x-2">
          <div className="text-sm flex-1 flex  items-start  space-x-2">
            <div className="border w-7 h-7 rounded-full flex items-center justify-center">
              <FaSpinner size={16} className="animate-spin "></FaSpinner>
            </div>
            <h6 className="max-w-[14rem] break-words">
              <b>
                <FaSpinner size={10} className="animate-spin"></FaSpinner>
              </b>
              {comment.data().comment}
            </h6>
          </div>

          <Moment
            interval={1000}
            className="pr-5 text-xs text-gray-500"
            fromNow
          >
            {comment.data().timestamp?.toDate()}
          </Moment>
        </div>
      ) : (
        <div className="flex items-start space-x-2">
          <div className="text-sm flex-1 flex  items-start  space-x-2">
            <img
              src={userInfo.photoURL}
              alt=""
              className="w-7 h-7  rounded-full object-cover"
            />
            <h6 className="max-w-[10rem] sm:max-w-[24rem] md:max-w-[32rem] lg:max-w-[13rem] break-words">
              <b>{userInfo.username}</b> {comment.data().comment}
            </h6>
          </div>

          <Moment
            interval={1000}
            className="pr-5 text-xs text-gray-500 hidden sm:block"
            fromNow
          >
            {comment.data().timestamp?.toDate()}
          </Moment>
        </div>
      )}
    </>
  );
};

export default Comment;

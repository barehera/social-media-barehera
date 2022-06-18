import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { messagesSelectedUser } from "../../../atoms/messagesUsersAtom";
import { BsTelephone, BsCameraVideo, BsInfoCircle } from "react-icons/bs";

const DirectRightSide = () => {
  const [selectedUser, setSelectedUser] = useRecoilState(messagesSelectedUser);
  useEffect(() => {
    setSelectedUser(null);
  }, []);
  const router = useRouter();
  return (
    <>
      <div className="w-4/6">
        {selectedUser ? (
          <div className="w-full h-full">
            {/*Header */}
            <div className="flex items-center h-16 border-b px-5">
              <div className="flex items-center flex-1">
                <div
                  onClick={() => router.push(`/${selectedUser.username}`)}
                  className="flex items-center cursor-pointer "
                >
                  <img
                    src={selectedUser?.profileImg}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <h3 className="text-sm font-semibold ml-2">
                    {selectedUser?.username}
                  </h3>
                </div>
              </div>
              <div className="flex gap-x-4">
                <BsTelephone
                  size={24}
                  className="cursor-pointer"
                  onClick={() => alert("work on progress")}
                ></BsTelephone>
                <BsCameraVideo
                  size={24}
                  className="cursor-pointer"
                  onClick={() => alert("work on progress")}
                ></BsCameraVideo>
                <BsInfoCircle
                  size={24}
                  className="cursor-pointer"
                  onClick={() => alert("work on progress")}
                ></BsInfoCircle>
              </div>
            </div>
            {/*Messages */}
            <div>MESSAGES</div>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center flex-col p-4 gap-y-2">
            <svg
              aria-label="Direct"
              color="#262626"
              fill="#262626"
              height="96"
              role="img"
              viewBox="0 0 96 96"
              width="96"
            >
              <circle
                cx="48"
                cy="48"
                fill="none"
                r="47"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></circle>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="69.286"
                x2="41.447"
                y1="33.21"
                y2="48.804"
              ></line>
              <polygon
                fill="none"
                points="47.254 73.123 71.376 31.998 24.546 32.002 41.448 48.805 47.254 73.123"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
              ></polygon>
            </svg>
            <h4 className="font-light text-2xl">Mesajların</h4>
            <p className="text-sm text-center text-gray-500">
              Bir arkadaşına veya gruba gizli fotoğraflar ve mesajlar gönder.
            </p>
            <button className="text-sm bg-blue-500 text-white px-2 py-1 rounded font-semibold mt-4">
              Mesaj Gönder
            </button>
          </div>
        )}

        {/*Selected Message */}
      </div>
    </>
  );
};

export default DirectRightSide;

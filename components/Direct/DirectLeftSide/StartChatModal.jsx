import React, { useEffect } from "react";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  arrayUnion,
  collection,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useRecoilState } from "recoil";
import { messagesUsers } from "../../../atoms/messagesUsersAtom";
import { useAuth } from "../../../context/AuthContext";
import Image from "next/image";
import { doc, setDoc } from "firebase/firestore";

const StartChatModal = ({ open, setOpen }) => {
  const [allUsers, setAllUsers] = useRecoilState(messagesUsers);
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(
        query(collection(db, "users"), where("username", "!=", user.username)),
        (snapshot) => {
          setAllUsers([]);
          snapshot.docs.forEach((doc) =>
            setAllUsers((allUsers) => [
              ...allUsers,
              { ...doc.data(), id: doc.id },
            ])
          );
        }
      );
      return unsub;
    }
  }, [db, user]);

  const handleStartChat = async (selectedUserId) => {
    await setDoc(doc(db, "messages", `${user.uid}-${selectedUserId}`), {
      users: [user.uid, selectedUserId],
    });
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      messageUsers: arrayUnion(selectedUserId),
    });
    const selectedUserRef = doc(db, "users", selectedUserId);
    await updateDoc(selectedUserRef, {
      messageUsers: arrayUnion(user.uid),
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="p-4 w-full bg-white flex flex-col">
                <h1 className="text-lg tracking-tighter border-b pb-1 border-gray-300">
                  Start Chat With
                </h1>
                <div className="max-h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-4 hover:bg-gray-200 transition-all duration-300 ease-out "
                    >
                      <div className="flex items-center flex-1 gap-x-4">
                        <Image
                          src={user.photoURL}
                          width={50}
                          height={50}
                          objectFit="cover"
                          className="rounded-full"
                        />
                        <p className="font-semibold">{user.username}</p>
                      </div>
                      <button
                        className="p-2 text-sm bg-blue-500 rounded text-white hover:scale-105 transition-all duration-300 ease-out"
                        onClick={() => handleStartChat(user.id)}
                      >
                        Start Chat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default StartChatModal;

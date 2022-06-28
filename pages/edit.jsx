import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AiOutlineEdit } from "react-icons/ai";
import { useRecoilState } from "recoil";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";
import EditModal from "../components/Edit/EditModal";
import { editModalState } from "../atoms/modalAtom";

const Edit = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useRecoilState(editModalState);
  const [editData, setEditData] = useState({
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    gender: user.gender,
    age: user.age,
  });

  const handleEdit = async (e) => {
    e.preventDefault();
    const userRef = doc(db, "users", user.uid);
    {
      /*Bio Change */
    }
    if (user.bio !== editData.bio) {
      await updateDoc(userRef, {
        bio: editData.bio,
      });
    }
    {
      /*Name Change */
    }
    if (user.displayName !== editData.displayName) {
      await updateDoc(userRef, {
        displayName: editData.displayName,
      });
    }
    {
      /*Gender Change */
    }
    if (user.gender !== editData.gender) {
      await updateDoc(userRef, {
        gender: editData.gender,
      });
    }
    {
      /*Age Change */
    }
    if (user.age !== editData.age) {
      await updateDoc(userRef, {
        age: editData.age,
      });
    }
    {
      /*Username Change */
    }
    if (user.username !== editData.username) {
      //Checking if username in use?
      const querySnapshot = await getDocs(
        query(
          collection(db, "users"),
          where("username", "==", editData.username)
        )
      );
      if (querySnapshot.docs.length > 0) {
        alert("Username already in use!");
        setEditData({
          ...editData,
          username: user.username,
        });
      } else {
        try {
          await updateDoc(userRef, {
            username: editData.username,
          });
        } catch (error) {
          alert(error.message);
        }
      }
    }

    router.reload(window.location.pathname);
  };

  return (
    <div className="bg-gray-100 relative w-full h-[calc(100vh_-_57px)] flex items-center justify-center">
      <div className="h-[calc(100%_-_3rem)] max-w-5xl w-full border border-gray-200 rounded-md bg-white flex  justify-center md:p-10 p-4">
        <form
          className="flex flex-col gap-y-5 justify-start items-start "
          onSubmit={handleEdit}
        >
          {/*User Photo and username */}
          <div className="flex  gap-x-2 items-center ">
            <div className="relative group h-32 w-32 rounded-full">
              <img
                src={user.photoURL}
                alt=""
                className="w-32 h-32 rounded-full object-cover"
              />
              <span
                onClick={() => setOpen(true)}
                className="absolute top-0 bg-gray-500 bg-opacity-30 w-32 h-32 rounded-full flex invisible opacity-0 items-center justify-center cursor-pointer group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-out"
              >
                <AiOutlineEdit size={40} className="text-white"></AiOutlineEdit>
              </span>
            </div>
            <div className="mt-2 ">
              <p className="text-lg font-normal ">{user.username}</p>
              <p className="text-lg font-light">{user.email}</p>
            </div>
          </div>
          {/*Name input */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-lg font-semibold">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="border border-gray-300 rounded p-2"
              value={editData.displayName ? editData.displayName : ""}
              onChange={(e) =>
                setEditData({ ...editData, displayName: e.target.value })
              }
            />
            <p className="text-xs text-gray-500">
              Adın ve soyadın, takma adın veya işletmenin adı gibi tanındığın
              bir adı kullanarak insanların hesabını keşfetmesine yardımcı ol.
            </p>
          </div>
          {/*username input */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-lg font-semibold">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="border border-gray-300 rounded p-2"
              value={editData.username ? editData.username : ""}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
            />
          </div>
          {/*Bio input */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-lg font-semibold">Bio</label>
            <textarea
              type="text"
              placeholder="Bio"
              className="border border-gray-300 rounded p-2 "
              value={editData.bio ? editData.bio : ""}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
            />
          </div>
          {/*age input */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-lg font-semibold">Age</label>
            <input
              type="number"
              placeholder="Age"
              className="border border-gray-300 rounded p-2 "
              value={editData.age ? editData.age : ""}
              onChange={(e) =>
                setEditData({ ...editData, age: e.target.value })
              }
            />
          </div>
          {/*Gender input */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-lg font-semibold">Gender</label>
            <select
              name="gender"
              id="gender"
              className="border border-gray-300 rounded p-2 "
              value={editData.gender ? editData.gender : ""}
              onChange={(e) =>
                setEditData({ ...editData, gender: e.target.value })
              }
            >
              <option value={null}>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 p-2 rounded text-white cursor-pointer hover:opacity-90 transition-all ease-out w-32 md:w-full "
          >
            Send
          </button>
        </form>
      </div>
      <EditModal></EditModal>
    </div>
  );
};

export default Edit;

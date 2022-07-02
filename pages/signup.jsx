import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const Signup = () => {
  const { user, signup } = useAuth();
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
    username: "",
  });

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const handleSignup = async (e) => {
    e.preventDefault();
    //Checking if username in use?
    const querySnapshot = await getDocs(
      query(collection(db, "users"), where("username", "==", data.username))
    );
    if (querySnapshot.docs.length > 0) {
      alert("Username already in use!");
      setData({
        ...data,
        username: "",
      });
    } else {
      try {
        await signup(data);
        router.push("/");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <>
      {user ? null : (
        <>
          <div className="flex flex-col gap-y-4 items-center justify-center bg-gray-100 min-h-screen w-screen px-4 ">
            {/*Main content card */}
            <div className="bg-white flex flex-col items-center text-center px-2 py-8 w-full border border-gray-300 max-w-md">
              <h1 className="text-5xl font-serif tracking-tighter  ">
                Barehera
              </h1>
              <p className="mb-6 text-sm text-gray-500">Social Media App...</p>
              <form
                onSubmit={handleSignup}
                className="flex flex-col gap-y-2 w-full px-6"
              >
                <input
                  type="text"
                  placeholder="E-mail"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="outline-none border-gray-300 h-8 placeholder:text-gray-500 placeholder:text-sm rounded-sm bg-gray-50"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={data.username}
                  onChange={(e) =>
                    setData({ ...data, username: e.target.value })
                  }
                  className="outline-none border-gray-300 h-8 placeholder:text-gray-500 placeholder:text-sm rounded-sm bg-gray-50"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  className="outline-none border-gray-300 h-8 placeholder:text-gray-500 placeholder:text-sm rounded-sm bg-gray-50"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-1 rounded hover:opacity-80 transition-all cursor-pointer"
                >
                  Sign up
                </button>
              </form>
            </div>
            {/*Dont have an account card */}
            <div className="w-full bg-white flex items-center justify-center p-4 gap-x-2 border border-gray-300 max-w-md">
              <h4>Have an account?</h4>
              <button
                className="text-blue-400"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Signup;

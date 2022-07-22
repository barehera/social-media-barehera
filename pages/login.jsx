import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await login(data.email, data.password);
    } catch (error) {
      alert(error.message);
    }
    setData({
      email: "",
      password: "",
    });
    router.push("/").then(() => setLoading(false));
  };

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
                onSubmit={handleLogin}
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
                  type="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  className="outline-none border-gray-300 h-8 placeholder:text-gray-500 placeholder:text-sm rounded-sm bg-gray-50"
                />
                <button
                  disabled={loading}
                  type="submit"
                  className="bg-blue-500 text-white h-10 rounded hover:opacity-80 transition-all cursor-pointer flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div>
                      <FaSpinner className="animate-spin"></FaSpinner>
                    </div>
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>

              <p
                className="text-sm text-gray-500 cursor-pointer mt-4"
                onClick={() => alert("work in progress...")}
              >
                Forgot your password?
              </p>
            </div>
            {/*Dont have an account card */}
            <div className="w-full bg-white flex items-center justify-center p-4 gap-x-2 border border-gray-300 max-w-md">
              <h4>Dont have a account?</h4>
              <button
                className="text-blue-400"
                onClick={() => router.push("/signup")}
              >
                Sign in
              </button>
            </div>
            {/*mobile download links */}
            <div className="flex flex-col items-center justify-center max-w-md">
              <p className="text-sm mb-4">Download the app.</p>
              <div className="flex space-x-2 items-center justify-center">
                <img
                  src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_turkish-tr.png/30b29fd697b2.png"
                  alt="appstore download"
                  className="w-36 h-full  object-contain cursor-pointer"
                />
                <img
                  src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_turkish-tr.png/9d46177cf153.png"
                  alt="googleplay download"
                  className="w-36 h-full  object-contain cursor-pointer"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;

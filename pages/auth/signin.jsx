import React from "react";
import { getProviders, signIn as SignIntoProvider } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const signIn = ({ providers }) => {
  return (
    <>
      <div className="flex flex-col gap-y-4 items-center justify-center bg-gray-100 min-h-screen w-screen px-4 ">
        {/*Main content card */}
        <div className="bg-white flex flex-col items-center text-center px-2 py-8 w-full border border-gray-300 max-w-md">
          <img
            src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
            alt="logo"
            className="my-6 cursor-pointer"
          />
          <div className="flex flex-col gap-y-2 w-full px-6">
            <input
              type="text"
              placeholder="E-mail"
              disabled
              className="outline-none border-gray-300 h-8 placeholder:text-gray-500 placeholder:text-sm rounded-sm bg-gray-50"
            />
            <input
              type="password"
              placeholder="Password"
              disabled
              className="outline-none border-gray-300 h-8 placeholder:text-gray-500 placeholder:text-sm rounded-sm bg-gray-50"
            />
            <button
              className="w-full bg-blue-400 text-white p-1 rounded-sm"
              onClick={() => alert("work in progress...")}
            >
              Login
            </button>
          </div>
          <div className="my-4 flex relative w-60 items-center justify-center">
            <span className="border-b-2 border-gray-200 w-24 absolute left-0"></span>
            <p className="text-sm text-gray-500">Or</p>
            <span className="border-b-2 border-gray-200 w-24 absolute right-0"></span>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  onClick={() =>
                    SignIntoProvider(provider.id, { callbackUrl: "/" })
                  }
                  className="flex items-center gap-x-2"
                >
                  <FcGoogle size={26}></FcGoogle>
                  <p className="text-sm">Sign in With {provider.name}</p>
                </button>
              </div>
            ))}
            <p
              className="text-sm text-gray-500 cursor-pointer"
              onClick={() => alert("work in progress...")}
            >
              Forgot your password?
            </p>
          </div>
        </div>
        {/*Dont have an account card */}
        <div className="w-full bg-white flex items-center justify-center p-4 gap-x-2 border border-gray-300 max-w-md">
          <h4>Dont have a account?</h4>
          <button
            className="text-blue-400"
            onClick={() => alert("work in progress...")}
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
              className="w-36  object-contain cursor-pointer"
              onClick={() => alert("work in progress...")}
            />
            <img
              src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_turkish-tr.png/9d46177cf153.png"
              alt="googleplay download"
              className="w-36  object-contain cursor-pointer"
              onClick={() => alert("work in progress...")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}

export default signIn;

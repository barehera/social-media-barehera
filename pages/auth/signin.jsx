import React from "react";
import { getProviders, signIn as SignIntoProvider } from "next-auth/react";
import { AiOutlineGooglePlus } from "react-icons/ai";

const signIn = ({ providers }) => {
  return (
    <>
      <div className="flex flex-col gap-y-4 items-center justify-center bg-gray-100 min-h-screen w-screen px-20">
        <div className="bg-white flex flex-col items-center text-center px-2 py-8 w-full border border-gray-300">
          <img
            src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
            alt="logo"
            className="my-6"
          />
          <div className="flex flex-col gap-y-2 w-full px-6">
            <h1>!!!!Only google signin works!!!!</h1>
            <input
              type="text"
              placeholder="E-mail"
              className="outline-none border-gray-300 h-8 placeholder:text-gray-500 placeholder:text-sm rounded-sm bg-gray-50"
            />
            <input
              type="password"
              placeholder="Password"
              className="outline-none border-gray-300 h-8 placeholder:text-gray-500 placeholder:text-sm rounded-sm bg-gray-50"
            />
            <button className="w-full bg-blue-400 text-white p-1 rounded-sm">
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
                  <AiOutlineGooglePlus size={26}></AiOutlineGooglePlus>
                  <p className="text-sm">Sign in With {provider.name}</p>
                </button>
              </div>
            ))}
            <p className="text-sm text-gray-500 cursor-pointer">
              Forgot your password?
            </p>
          </div>
        </div>

        <div className="w-full bg-white flex items-center justify-center p-4 gap-x-2 border border-gray-300">
          <h4>Dont have a account?</h4>
          <button className="text-blue-400">Sign in</button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm">Download the app.</p>
          <div className="flex space-x-2">
            <img
              src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_turkish-tr.png/30b29fd697b2.png"
              alt="appstore download"
              className="w-36 h-24 object-contain cursor-pointer"
            />
            <img
              src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_turkish-tr.png/9d46177cf153.png"
              alt="googleplay download"
              className="w-36 h-24 object-contain cursor-pointer"
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

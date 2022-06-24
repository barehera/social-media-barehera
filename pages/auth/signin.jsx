import React from "react";
import { getProviders, signIn as SignIntoProvider } from "next-auth/react";

const signIn = ({ providers }) => {
  return (
    <>
      <div className="flex flex-col gap-y-4 items-center justify-center bg-gray-100 min-h-screen w-screen px-4">
        {/*Main content card */}
        <div className="bg-white flex flex-col items-center justify-center rounded-lg text-center w-full py-4 border border-gray-300 max-w-md">
          <div className="mb-5 flex flex-col items-center justify-center">
            <h1 className="text-4xl tracking-tighter font-black font-serif">
              Barehera
            </h1>
            <p className="text-gray-500 tracking-widest">Social Media App</p>
          </div>

          <div className="flex flex-col items-center gap-y-2">
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  onClick={() =>
                    SignIntoProvider(provider.id, { callbackUrl: "/" })
                  }
                  className="flex items-center gap-x-2 bg-blue-500  p-2 rounded"
                >
                  <p className="text-sm text-white">
                    Sign in With {provider.name}
                  </p>
                </button>
              </div>
            ))}
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

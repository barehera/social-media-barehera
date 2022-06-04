import React from "react";
import MiniProfile from "./MiniProfile";
import Posts from "./Posts";
import Stories from "./Stories";
import Suggestions from "./Suggestions";

import { useSession } from "next-auth/react";

const Feed = () => {
  const { data: session } = useSession();
  return (
    <>
      <main className=" grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-4xl mx-auto">
        <section className={`col-span-2 ${!session && "!col-span-3"}`}>
          <Stories></Stories>
          <Posts></Posts>
        </section>
        {session && (
          <section className=" hidden xl:inline-grid md:col-span-1 mt-6 ml-10">
            <div className="fixed ">
              <MiniProfile></MiniProfile>
              <Suggestions></Suggestions>
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default Feed;

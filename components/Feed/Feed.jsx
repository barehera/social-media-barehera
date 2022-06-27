import React from "react";
import MiniProfile from "./SideBar/MiniProfile";
import Posts from "./Posts/Posts";
import SuggestionsSideBar from "./SideBar/SuggestionsSideBar";
import { useAuth } from "../../context/AuthContext";

const Feed = () => {
  const { user } = useAuth();

  return (
    <>
      <main className=" grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-4xl mx-auto">
        <section className={`col-span-2 ${!user && "!col-span-3"}`}>
          <Posts></Posts>
        </section>
        {user && (
          <section className=" hidden xl:inline-grid md:col-span-1 mt-6 ml-10">
            <div className="fixed ">
              <MiniProfile></MiniProfile>
              <SuggestionsSideBar></SuggestionsSideBar>
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default Feed;

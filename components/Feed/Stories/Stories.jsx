import React, { useEffect, useState } from "react";
import axios from "axios";
import Story from "./Story/Story";
import { useSession } from "next-auth/react";
import StoryLoader from "./Story/StoryLoader";

const Stories = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getRandomUser = async () => {
      setLoading(true);
      await axios
        .get("https://randomuser.me/api/?results=30")
        .then((data) => {
          setUsers(data.data.results);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    };

    getRandomUser();
  }, []);

  const { data: session } = useSession();
  return (
    <div>
      {loading ? (
        <div className="p-4 flex gap-x-4 bg-white rounded-sm mt-6 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50 ">
          {[...Array(30)].map((e, i) => (
            <StoryLoader key={i}>♦</StoryLoader>
          ))}
        </div>
      ) : (
        <div className="p-4 flex gap-x-4 bg-white rounded-sm mt-6 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
          {session && (
            <Story
              key={session.user.uid}
              img={session.user.image}
              username={session.user.username}
              self={true}
            ></Story>
          )}
          {users.map((user) => (
            <Story
              key={user.login.uuid}
              img={user.picture.medium}
              username={user.login.username}
            ></Story>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stories;

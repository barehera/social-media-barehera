import React, { useEffect, useState } from "react";
import axios from "axios";
import Story from "./Story";
import { useSession } from "next-auth/react";

const Stories = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getRandomUser = async () => {
      const user = await axios
        .get("https://randomuser.me/api/?results=30")
        .then((data) => {
          setUsers(data.data.results);
        })
        .catch((err) => console.log(err));
    };

    getRandomUser();
  }, []);

  const { data: session } = useSession();
  return (
    <div className="p-4 flex gap-x-4 bg-white rounded-sm mt-6 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-50">
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
  );
};

export default Stories;

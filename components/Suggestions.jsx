import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const Suggestions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getRandomUser = async () => {
      setLoading(true);
      const user = await axios
        .get("https://randomuser.me/api/?results=6")
        .then((data) => {
          setUsers(data.data.results);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    };

    getRandomUser();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="w-full h-80 flex items-center justify-center">
          <FaSpinner className="animate-spin" size={30}></FaSpinner>
        </div>
      ) : (
        <div className="mt-4 ">
          <div className="flex justify-between mb-4 items-center">
            <h4 className="text-gray-400">Suggestions for you</h4>
            <button>See All</button>
          </div>
          <div className="flex flex-col gap-y-4">
            {users.map((user) => (
              <div
                key={user.login.uuid}
                className="flex items-center space-x-4"
              >
                <img
                  src={user.picture.large}
                  alt="user pic"
                  className="w-12 h-12 rounded-full border p-1"
                />
                <div className="flex-1">
                  <h4 className="font-bold">{user.login.username}</h4>
                  <p className="text-gray-400 text-sm">
                    {user.location.city} {user.location.state}{" "}
                    {user.location.country}
                  </p>
                </div>
                <button className="text-blue-400">Follow</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Suggestions;

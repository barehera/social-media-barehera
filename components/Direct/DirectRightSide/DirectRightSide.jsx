import React from "react";

const DirectRightSide = () => {
  return (
    <div className="w-4/6 ">
      <div className="w-full h-full flex justify-center items-center flex-col p-4 gap-y-2">
        <svg
          aria-label="Direct"
          color="#262626"
          fill="#262626"
          height="96"
          role="img"
          viewBox="0 0 96 96"
          width="96"
        >
          <circle
            cx="48"
            cy="48"
            fill="none"
            r="47"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          ></circle>
          <line
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="69.286"
            x2="41.447"
            y1="33.21"
            y2="48.804"
          ></line>
          <polygon
            fill="none"
            points="47.254 73.123 71.376 31.998 24.546 32.002 41.448 48.805 47.254 73.123"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></polygon>
        </svg>
        <h4 className="font-light text-2xl">Mesajların</h4>
        <p className="text-sm text-center text-gray-500">
          Bir arkadaşına veya gruba gizli fotoğraflar ve mesajlar gönder.
        </p>
        <button className="text-sm bg-blue-500 text-white px-2 py-1 rounded font-semibold mt-4">
          Mesaj Gönder
        </button>
      </div>
    </div>
  );
};

export default DirectRightSide;

import React from "react";
import DirectLeftSide from "./DirectLeftSide/DirectLeftSide";
import DirectRightSide from "./DirectRightSide/DirectRightSide";

const DirectMain = () => {
  return (
    <div className="bg-gray-100 relative w-full h-[calc(100vh_-_57px)] flex items-center justify-center">
      <div className="h-[calc(100%_-_3rem)] max-w-5xl w-full border border-gray-200 rounded-md bg-white flex">
        <DirectLeftSide></DirectLeftSide>
        <DirectRightSide></DirectRightSide>
      </div>
      {/*Mobile direct */}
      <div></div>
    </div>
  );
};

export default DirectMain;

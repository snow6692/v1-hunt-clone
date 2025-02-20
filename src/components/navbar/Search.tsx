import React from "react";
import { PiMagnifyingGlass } from "react-icons/pi";
function Search() {
  return (
    <div className="relative ml-4 flex items-center rounded-full bg-[#f5f5ff] text-gray-500">
      <PiMagnifyingGlass className="ml-2" />
      <input
        type="text"
        placeholder="Search..."
        name=""
        id=""
        className="rounded-full bg-[#f5f5ff] p-2 text-xs focus:outline-none"
      />
    </div>
  );
}

export default Search;

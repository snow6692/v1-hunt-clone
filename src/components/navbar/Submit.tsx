"use client";

import Link from "next/link";

const Submit = () => {
  return (
    <div className="">
      <Link href={"/new-product"} className="text-[#ff6154]">
        Submit
      </Link>
    </div>
  );
};

export default Submit;

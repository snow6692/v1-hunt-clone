import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <div>
      <Link href={"/"} className="md:hidden">
        <Image
          className=""
          alt="logo"
          src={"/logo/small-logo.png"}
          width={36}
          height={36}
        />
      </Link>
      <Link href={"/"} className="hidden md:block">
        <Image
          className="p-1"
          alt="logo"
          src={"/logo/logo.png"}
          width={100}
          height={100}
        />
      </Link>
    </div>
  );
}

export default Logo;

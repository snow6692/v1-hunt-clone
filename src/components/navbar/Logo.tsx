import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <div>
      <Link href={"/"} className="pt-5 md:hidden">
        <Image
          className="p-1"
          alt="logo"
          src={"/logo/small-logo.png"}
          width={50}
          height={50}
        />
      </Link>
      <Link href={"/"} className="hidden pt-5 md:block">
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

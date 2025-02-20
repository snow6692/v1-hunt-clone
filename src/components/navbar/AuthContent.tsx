"use client";
import Image from "next/image";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

function AuthContent() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={"/logo/small-logo.png"}
        width={200}
        height={200}
        alt="logo"
        className="p-10"
      />
      <div className="flex flex-col items-center justify-center text-center">
        <div className="py-4 text-2xl font-medium">
          See what&apos;s new in tech
        </div>
        <div className="w-4/5 text-base text-gray-600">
          Join our community of friendly folks discovering and sharing the
          latest product in tech
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => signIn("google", { redirect: false })}
          className="mt-4 flex items-center gap-4 rounded-md border px-10 py-2"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("github", { redirect: false })}
          className="mt-4 flex items-center gap-4 rounded-md border px-10 py-2"
        >
          <FaGithub className="text-xl text-purple-800" />
          Sign in with Github
        </button>
      </div>
    </div>
  );
}

export default AuthContent;

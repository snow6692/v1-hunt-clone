"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import Search from "./Search";
import Menu from "./Menu";
import SignInButton from "./SignInButton";
import SignUpButton from "./SignUpButton";
import Modal from "../ui/modals/modal";
import AuthContent from "./AuthContent";
import { User } from "next-auth";
import AvatarComponent from "./Avatar";
import NotificationIcon from "./NotificationIcon";
import Submit from "./Submit";
import { Notification } from "@prisma/client";

interface IProps {
  user: User | undefined;
  notifications: Notification[] | null;
}
function Navbar({ user,notifications }: IProps) {
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handleButtonClick = () => {
    setAuthModalVisible(true);
  };
  return (
    <header className="border-b px-4 py-2 md:px-6 md:py-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center text-center">
          <Logo />
          <Search />
        </div>
        <div className="absolute right-1/2 z-10 translate-x-1/2 transform">
          <Menu />
        </div>

        <div className="flex cursor-pointer items-center space-x-6 text-sm">
          {user ? (
            <>
              <Submit />
              <NotificationIcon notifications={notifications} />
              <AvatarComponent image={user.image!} />
            </>
          ) : (
            <div
              onClick={handleButtonClick}
              className="flex cursor-pointer items-center space-x-6 text-sm"
            >
              <SignInButton />
              <SignUpButton />
            </div>
          )}
        </div>

        <Modal setVisible={setAuthModalVisible} visible={authModalVisible}>
          <AuthContent />
        </Modal>
      </div>
    </header>
  );
}

export default Navbar;

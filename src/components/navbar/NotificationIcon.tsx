"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  deleteAllNotifications,
  markAllNotificationsAsRead,
} from "@/lib/actions/productAction";
import { Notification } from "@prisma/client";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PiBell } from "react-icons/pi";
import { toast } from "sonner";
interface IProps {
  notifications: Notification[] | null;
}
function NotificationIcon({ notifications }: IProps) {
  const [unreadNotifications, setUnreadNotifications] = useState(
    notifications?.filter((notification) => notification.status === "UNREAD")
      .length || 0,
  );
  const [allNotifications, setAllNotifications] = useState(notifications);

  const timeAgo = (date: string | Date) => {
    const now = new Date();
    const time = new Date(date);
    const diff = now.getTime() - time.getTime();

    const seconds = diff / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (seconds < 60) {
      return "Just now";
    } else if (minutes < 60) {
      return `${Math.floor(minutes)}m ago`;
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`;
    } else {
      return `${Math.floor(days)}d ago`;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setUnreadNotifications(0);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteAllNotifications = async () => {
    await deleteAllNotifications();
    setAllNotifications(null);
    toast.success("All Notifications deleted successfully");
  };
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <div className="flex items-center">
            <PiBell className="text-xl text-gray-600" />
            {unreadNotifications > 0 && (
              <div className="absolute mb-3 ml-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadNotifications}
              </div>
            )}
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              View all your notifications here
            </SheetDescription>
          </SheetHeader>
          {unreadNotifications === 0 ? (
            <>
              <div className="flex items-center justify-between py-6">
                <h1 className="text-sm text-gray-500">No new notifications</h1>
                <div className="">
                  {allNotifications ? (
                    <div
                      className="flex cursor-pointer items-center justify-center text-red-400 transition-all duration-300 hover:scale-105 hover:text-red-500"
                      onClick={handleDeleteAllNotifications}
                    >
                      <TrashIcon className="size-6" /> Delete All
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <div className="py-6">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-red-500 hover:underline"
              >
                Mark all as read
              </button>
            </div>
          )}

          <div className="flex flex-col gap-y-4">
            {allNotifications?.map((notification) => (
              <div key={notification.id} className="flex items-center gap-x-4">
                <Image
                  priority
                  src={notification.profilePicture}
                  alt="profile picture"
                  width={50}
                  height={50}
                  className="h-8 w-8 rounded-full"
                />
                {notification.status === "UNREAD" ? (
                  <div>
                    <p className="text-xs">
                      {notification.createdAt &&
                        timeAgo(notification.createdAt)}
                    </p>
                    <h1 className="text-sm font-medium">{notification.body}</h1>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <p className="text-xs text-gray-500">
                      {notification.createdAt &&
                        timeAgo(notification.createdAt)}
                    </p>
                    <h1 className="text-sm text-gray-500">
                      {notification.body}
                    </h1>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default NotificationIcon;

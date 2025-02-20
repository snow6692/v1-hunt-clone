"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PiBell } from "react-icons/pi";

function NotificationIcon() {
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <div className="flex items-center">
            <PiBell className="text-xl text-gray-600" />
            {/* {unreadNotifications > 0 && (
              <div className="absolute mb-3 ml-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadNotifications}
              </div>
            )} */}
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              View all your notifications here
            </SheetDescription>
          </SheetHeader>
          {/* {unreadNotifications === 0 ? (
            <>
              <div className="flex items-center py-6">
                <h1 className="text-sm text-gray-500">No new notifications</h1>
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
          )} */}

          <div className="flex flex-col gap-y-4">
            {/* {allNotifications?.map((notification: any) => (
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
            ))} */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default NotificationIcon;

import React from "react";
import { AvatarFallback, Avatar, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { PiGear, PiHeart, PiPackage } from "react-icons/pi";
import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps {
  image: string;
}
function AvatarComponent({ image }: IProps) {
  const router = useRouter();
  const handleMyUpvotes = () => {
    router.refresh();
    router.push("/my-upvoted");
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar>
            <AvatarFallback className="size-[40px] rounded-full bg-black" />
            <AvatarImage src={image!} />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 space-y-1 p-2 text-gray-600">
          <DropdownMenuItem>
            <Link
              href="/my-products"
              className="flex w-full cursor-pointer gap-x-2 rounded-sm"
            >
              <PiPackage className="text-xl" />
              My Products
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div
              onClick={handleMyUpvotes}
              className="flex w-full cursor-pointer gap-x-2 rounded-sm"
            >
              <PiHeart className="text-xl" />
              Upvoted
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/settings"
              className="flex w-full cursor-pointer gap-x-2 rounded-sm"
            >
              <PiGear className="text-xl" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <LogOutIcon />
            <div onClick={() => signOut()}>Log out</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AvatarComponent;

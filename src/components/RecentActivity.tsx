import { User } from "@prisma/client";
import Image from "next/image";

interface RecentActivityProps {
  users: User[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ users }) => {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex w-full items-center gap-x-6">
          <div className="text-2xl">🎉</div>
          <Image
            src={user.image}
            width={50}
            height={50}
            alt="user"
            className="h-8 w-8 rounded-full"
          />
          <div className="text-gray-500">{user.name} has joined</div>
          <div className="text-xs text-gray-800">
            {new Date(user.createdAt).toDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;

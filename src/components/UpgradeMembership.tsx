// import { createCheckoutSession } from "@/lib/stripe";
import { createCheckoutSession } from "@/lib/stripe";
import { User } from "next-auth";
import Image from "next/image";
import { toast } from "sonner";

interface UpgradeMembershipProps {
  authenticatedUser: User | undefined;
}

const UpgradeMembership: React.FC<UpgradeMembershipProps> = ({
  authenticatedUser,
}) => {
  const handleCallCheckoutSession = async () => {
    try {
      const result = await createCheckoutSession({
        email: authenticatedUser?.email,
      });

      if (result && result.url) {
        window.location.href = result.url;
      } else {
        throw new Error("Error creating checkout session");
      }
    } catch {
      toast.error("Could not create checkout session. Please try again later.");
    }
  };

  return (
    <div className="space-y-6">
      <Image
        src={"/images/start-up-14.png"}
        width={150}
        height={150}
        alt="Upgrade Membership"
        className="mx-auto"
      />
      <h1 className="text-center text-2xl font-semibold">
        Go Pro and unlock more features
      </h1>
      <p className="text-center text-gray-600">
        Looking to create more projects ? Upgrade your membership to unlock
        unlimited projects
      </p>

      <div className="pt-4">
        <button
          onClick={handleCallCheckoutSession}
          className="w-full rounded-md bg-indigo-500 p-2 text-white"
        >
          Upgrade Membership
        </button>
      </div>
    </div>
  );
};

export default UpgradeMembership;

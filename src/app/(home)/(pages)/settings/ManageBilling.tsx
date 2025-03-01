"use client";

import { createCustomerLink } from "@/lib/stripe";
import { toast } from "sonner";

const ManageBilling = () => {
  const handleManageBilling = async () => {
    try {
      const result = await createCustomerLink();
      if (result) {
        window.location.href = result;
      } else {
        throw new Error("Error creating customer portal link");
      }
    } catch {
      toast.error("Could not create checkout session. Please try again");
    }
  };

  return (
    <button
      onClick={handleManageBilling}
      className="mt-10 cursor-pointer text-blue-500 hover:underline"
    >
      Manage Billing
    </button>
  );
};

export default ManageBilling;

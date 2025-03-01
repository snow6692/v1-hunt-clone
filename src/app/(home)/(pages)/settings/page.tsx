import { auth } from "@/auth";
import { isUserPremium } from "@/lib/actions/productAction";
import { redirect } from "next/navigation";
import React from "react";
import ManageBilling from "./ManageBilling";

async function SettingsPage() {
  const authenticatedUser = await auth();

  if (!authenticatedUser) {
    redirect("/");
  }

  const isPremium = await isUserPremium();
  //   const subscriptionDetails = await getNextPaymentDetails();
  return (
    <div className="mx-auto px-6 py-10 md:w-3/5 md:px-0">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-gray-500">Manage your settings</p>

      <div className="mt-10">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h1>Next Payment Date</h1>
            {/* <p className="text-sm font-light text-gray-400">
              {subscriptionDetails
                ? subscriptionDetails.nextPaymentDate
                : "No payment date"}
            </p> */}
            2202
          </div>
          <div className="flex items-center justify-between">
            <h1>Next payment amount</h1>
            <p>$1.99</p>
          </div>
          <hr />
          {isPremium ? (
            <>
              <ManageBilling />
            </>
          ) : (
            <div className="mt-10 cursor-pointer text-blue-500 hover:underline">
              Membership Info
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

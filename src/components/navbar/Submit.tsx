"use client";

import { Product } from "@prisma/client";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MembershipModal from "../modals/MembershipModal";
import { isUserPremium } from "@/lib/actions/productAction";
import UpgradeMembership from "../UpgradeMembership";

interface IProps {
  products: Product[];
  user: User | undefined;
}
const Submit = ({ products, user }: IProps) => {
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);

  const router = useRouter();

  const handleClick = async () => {
    const isPremium = await isUserPremium();
    if (!isPremium && products.length === 2) {
      setIsUpgradeModalVisible(true);
    } else {
      router.push("/new-product");
    }
  };
  return (
    <div className="">
      <div>
        <button onClick={handleClick} className="text-[#ff6154]">
          Submit
        </button>
        <MembershipModal
          visible={isUpgradeModalVisible}
          setVisible={setIsUpgradeModalVisible}
        >
          Upgrade now
          <UpgradeMembership authenticatedUser={user} />
        </MembershipModal>
      </div>
    </div>
  );
};

export default Submit;

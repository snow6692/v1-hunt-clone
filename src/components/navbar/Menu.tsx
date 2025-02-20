"use client";

import { useState } from "react";
import LaunchesMenu from "./menus/LaunchesMenu";
import Link from "next/link";
import CommunityMenu from "./menus/CommunityMenu";
import AboutMenu from "./menus/AboutMenu";

function Menu() {
  const [showLaunchesMenu, setShowLaunchesMenu] = useState(false);
  const [showCommunityMenu, setCommunityMenu] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  return (
    <div className="relative hidden items-center lg:flex">
      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <div
          className="py-4 hover:text-[#ff6154]"
          onMouseEnter={() => setShowLaunchesMenu(true)}
          onMouseLeave={() => setShowLaunchesMenu(false)}
        >
          Launches {showLaunchesMenu && <LaunchesMenu />}
        </div>
        <Link href={"/categories"} className="hover:text-[#ff6154]">
          Categories
        </Link>
        <div
          className="py-4 hover:text-[#ff6154]"
          onMouseEnter={() => setCommunityMenu(true)}
          onMouseLeave={() => setCommunityMenu(false)}
        >
          Community {showCommunityMenu && <CommunityMenu />}
        </div>
        <div
          className="py-4 hover:text-[#ff6154]"
          onMouseEnter={() => setShowAboutMenu(true)}
          onMouseLeave={() => setShowAboutMenu(false)}
        >
          About {showAboutMenu && <AboutMenu />}
        </div>
      </div>
    </div>
  );
}

export default Menu;

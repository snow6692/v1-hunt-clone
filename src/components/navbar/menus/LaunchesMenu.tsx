import React from "react";

const items = [
  {
    icon: "🗓️",
    title: "Coming Soon",
    description: " Check out launches that are coming soon",
  },
  {
    icon: "❓",
    title: "Product Questions",
    description: "Answer the most interesting questions",
  },
  {
    icon: "🔮",
    title: "Launch archive",
    description: " Most-loved launches by the community",
  },
  {
    icon: "📰",
    title: "Newsletter",
    description: "The best of Bird, everyday",
  },
];

function LaunchesMenu() {
  return (
    <div className="absolute top-full rounded-sm border bg-white text-gray-600 shadow-md">
      <div className="flex cursor-pointer p-4">
        <div className="flex flex-col items-start space-y-3">
          {items.map((item) => (
            <div key={item.icon} className="flex items-center gap-4">
              <div className="rounded-sm bg-white p-1 shadow-sm">
                {item.icon}
              </div>
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="w-60 text-xs">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LaunchesMenu;

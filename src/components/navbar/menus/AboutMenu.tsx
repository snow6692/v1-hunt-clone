const items = [
  {
    title: "About Us",
  },
  {
    title: "Careers",
  },
  {
    title: "Apps",
  },
  {
    title: "FAQs",
  },
  {
    title: "Legal",
  },
];

const AboutMenu = () => {
  return (
    <div className="absolute top-full w-32 rounded-sm border border-gray-200 bg-white text-gray-600 shadow-md">
      <ul className="flex cursor-pointer flex-col items-start space-y-2 p-4">
        {items.map((item, index) => (
          <div key={index} className="flex">
            <div className="text-sm">{item.title}</div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default AboutMenu;

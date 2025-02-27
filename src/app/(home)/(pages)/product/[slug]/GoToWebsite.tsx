"use client";

function GoToWebsite({ website }: { website: string }) {
  const fixedUrl = website.startsWith("http") ? website : `https://${website}`;

  return (
    <a
      href={fixedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer hover:underline"
    >
      Go to website
    </a>
  );
}

export default GoToWebsite;

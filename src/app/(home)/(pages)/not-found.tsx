import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-20 flex flex-col items-center">
      <Link href="/" className="text-4xl ">
        This page not found Return Home
      </Link>
    </div>
  );
}

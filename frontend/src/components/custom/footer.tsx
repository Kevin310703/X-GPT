import Link from "next/link";

export function Footer() {
  return (
    <div className="dark bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="mt-4 md:mt-0 text-sm text-gray-300">© 2024 X-OR AI GENERATIVE</p>
      </div>
    </div>
  );
}
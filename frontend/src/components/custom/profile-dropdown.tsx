'use client';

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getStrapiURL } from "@/lib/utils";

export default function ProfileDropdown({ user, logoutAction }: { user: any; logoutAction: any }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const baseUrl = getStrapiURL();
  
  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownVisible((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={toggleDropdown}
        className="cursor-pointer"
        aria-haspopup="true"
        aria-expanded={dropdownVisible}
      >
        <img
          src={baseUrl + `${user.data?.image?.url}`}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-md object-cover hover:border-blue-500 transition-all duration-300"
        />
      </button>

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <div
          className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl ring-1 ring-gray-200 z-50"
          role="menu"
        >
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <Link
                href={`/dashboard/account/${user.data.documentId}`}
                className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-all rounded-lg"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href={`/auth/changepassword/${user.data.documentId}`}
                className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-all rounded-lg"
              >
                Change password
              </Link>
            </li>
            <li
              onClick={logoutAction} // Trigger the logout action directly
              className="block px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all rounded-lg cursor-pointer"
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

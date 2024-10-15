import React from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";

const Navbar = () => {
    const isActive = (path: string) => window.location.pathname === path;
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-900">
        <div className="flex-shrink-0">
            <Header />
        </div>

        <div className="flex space-x-6">
            <Link href="/home" className={`text-primary-300 hover:underline ${isActive("/home") ? "opacity-100" : "opacity-50 hover:opacity-100"}`}>
            Home
            </Link>
            <Link href="" className={`text-primary-300 hover:underline ${isActive("/about") ? "opacity-100" : "opacity-50 hover:opacity-100"}`}>
            About Us
            </Link>
            <Link href="https://github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g15" className="text-primary-300 opacity-50 hover:underline hover:opacity-100">
            Our Codebase
            </Link>
        </div>
        </nav>
    );
};

export default Navbar;
"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

export function GlobalNavigation() {
    const pathname = usePathname();
    const isHidden = pathname === "/login" || pathname?.startsWith("/dashboard");

    if (isHidden) {
        return null;
    }

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:block sticky top-0 z-50 bg-white shadow-sm">
                <AnnouncementBar />
                <Navbar />
                <MegaMenu />
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden sticky top-0 z-50 bg-white shadow-sm">
                <AnnouncementBar />
                <MobileNav />
            </div>
        </>
    );
}

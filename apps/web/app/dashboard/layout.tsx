import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:block w-64 flex-shrink-0">
                <AdminSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />

                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

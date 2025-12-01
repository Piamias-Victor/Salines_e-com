'use client';

import { Bell, Menu, User } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
    onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left: Menu button (mobile) */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#fe0090] transition-colors"
                >
                    <Menu size={24} />
                </button>

                {/* Center: Page title (will be dynamic later) */}
                <div className="flex-1 md:flex-initial">
                    <h2 className="text-xl font-bold text-[#3f4c53]">Dashboard</h2>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#fe0090] transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#fe0090] rounded-full"></span>
                    </button>

                    {/* User */}
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-[#fe0090] flex items-center justify-center text-white">
                            <User size={16} />
                        </div>
                        <span className="hidden md:block text-sm font-medium text-gray-700">
                            Admin
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}

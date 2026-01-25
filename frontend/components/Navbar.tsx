'use client';

import Image from "next/image";
import { Roboto } from "next/font/google";
import { LogOut, User, User2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { SocialButton } from "./base/buttons/social-button";
import { mockUser } from "@/lib/mockData";

const roboto = Roboto({
    subsets: ['latin'],
    display: 'swap',
    weight: ['800'],
})

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if user is "logged in" (mock)
        const isLoggedIn = localStorage.getItem('mockLoggedIn');
        if (isLoggedIn === 'true') {
            setUser(mockUser);
        }
    }, []);

    const handleLogin = async () => {
        try {
            localStorage.setItem('mockLoggedIn', 'true');
            setUser(mockUser);
            toast.success("Logged in successfully");
        } catch (error) {
            console.error("Login error", error);
            toast.error("Failed to login");
        }
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem('mockLoggedIn');
            setUser(null);
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error", error);
            toast.error("Failed to logout");
        }
    };

    return (
        <nav className="w-full h-25 flex justify-center items-center px-4 md:px-6">
            <div className="bg-white w-full max-w-6xl h-16 rounded-full px-6 shadow-sm border border-slate-100 grid grid-cols-3 items-center">

                {/* Left: Spacer (or future back button) */}
                <div className="flex justify-start">
                    <div className="w-10" />
                </div>

                {/* Center: Logo */}
                <div className="flex justify-center">
                    <h1 className={`${roboto.className} text-2xl font-bold text-[#4F6EF7] tracking-tight`}>Together</h1>
                </div>

                {/* Right: User Actions */}
                <div className="flex justify-end">
                    {isMounted && (user ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="outline-none rounded-full ring-offset-2 focus:ring-2 ring-[#4F6EF7]/20 transition-all">
                                    <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden border border-slate-200">
                                        <Image
                                            src={user?.avatar || '/images/avatar-female.svg'}
                                            fill
                                            className="object-cover"
                                            alt="User avatar"
                                        />
                                    </div>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2" align="end">
                                <div className="flex items-center gap-2 p-2 mb-2 border-b border-slate-100">
                                    <div className="w-8 h-8 relative rounded-full overflow-hidden bg-slate-100">
                                        <Image
                                            src={user?.avatar || '/images/avatar-female.svg'}
                                            fill
                                            className="object-cover"
                                            alt="User"
                                        />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm font-medium truncate">{user?.name || 'User'}</span>
                                        <span className="text-xs text-slate-500 truncate">{user?.email || ''}</span>
                                        <span className="text-xs text-slate-500 truncate">{user.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start h-9 px-2 text-sm font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <SocialButton
                            social="google"
                            size="sm"
                            theme="brand"
                            className="hidden md:inline-flex"
                            onClick={handleLogin}
                        >
                            Login
                        </SocialButton>
                    ))}
                </div>
            </div>
        </nav>
    );
}

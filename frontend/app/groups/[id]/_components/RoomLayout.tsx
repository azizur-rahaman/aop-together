'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronLeft, ChevronRight, PanelRightClose, PanelRightOpen, Menu } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn exists, if not I'll use template literals

export function RoomLayout({
    children,
    sidebar
}: {
    children: React.ReactNode;
    sidebar: React.ReactNode;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="w-full h-dvh flex overflow-hidden bg-slate-950">
            {/* Main Content (Video) */}
            <div className="flex-1 relative min-w-0 flex flex-col">
                {children}
            </div>

            {/* Sidebar */}
            <div
                className={`
          flex flex-col border-l border-slate-800 bg-slate-950 
          ${isMounted ? 'transition-all duration-300 ease-in-out' : ''} 
          relative z-40
          ${isSidebarOpen ? 'w-full md:w-[350px] lg:w-[400px]' : 'w-[60px]'}
        `}
            >
                {/* Toggle / Header for Sidebar - Only visible when collapsed or on top */}
                <div className="h-14 border-b border-slate-800 flex items-center justify-center flex-shrink-0 bg-slate-900/50 backdrop-blur">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="text-slate-400 hover:text-white"
                        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        {isSidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
                    </Button>
                </div>

                {/* Content Container */}
                <div className={`flex-1 overflow-hidden relative ${!isSidebarOpen ? 'invisible opacity-0 absolute pointer-events-none' : 'visible opacity-100'}`}>
                    {sidebar}
                </div>

                {/* Collapsed State Icons */}
                {!isSidebarOpen && (
                    <div className="flex flex-col items-center gap-4 py-4 absolute top-14 left-0 w-full animate-in fade-in duration-300">
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Chat & Problems"
                            onClick={() => setSidebarOpen(true)}
                            className="text-slate-400 hover:text-white"
                        >
                            <MessageSquare />
                        </Button>
                        {/* Add more icons here if needed acting as tabs in the future */}
                    </div>
                )}
            </div>
        </div>
    );
}

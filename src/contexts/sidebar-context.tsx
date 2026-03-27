'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    setIsCollapsed: () => { },
});

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load sidebar state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('sidebar-collapsed');
        if (savedState !== null) {
            setIsCollapsed(JSON.parse(savedState));
        }
        setMounted(true);
    }, []);

    // Save sidebar state to localStorage whenever it changes
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
        }
    }, [isCollapsed, mounted]);

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarState() {
    return useContext(SidebarContext);
}

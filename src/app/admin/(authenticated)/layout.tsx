import { ReactNode } from 'react';
import { SidebarProvider } from '@/contexts/sidebar-context';
import { SidebarLayout } from '@/components/layouts/sidebar-layout';
import { AdminSidebar } from '@/components/admin/sidebar/admin-sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
    // Basic setup for admin layout mimicking artisan layout.
    // In a full app, server-side protection happens at middleware or layout level.
    
    return (
        <SidebarProvider>
            <SidebarLayout sidebar={<AdminSidebar />}>
                {children}
            </SidebarLayout>
        </SidebarProvider>
    );
}
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs}>
                {children}
            </AppLayoutTemplate>
            {/* Layouts render under Inertia's page provider, so flash props are available here. */}
            <Toaster />
        </>
    );
}

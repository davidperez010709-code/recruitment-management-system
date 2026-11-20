import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BriefcaseBusiness,
    Building2,
    ClipboardList,
    FileBarChart2,
    GraduationCap,
    LayoutGrid,
    ShieldCheck,
    UsersRound,
    Video,
    Bell,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const user = auth.user;
    const can = (permission: string) =>
        user?.permissions.includes(permission) ?? false;
    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        ...(can('view vacancies')
            ? [
                  {
                      title: 'Vacancies',
                      href: '/vacancies',
                      icon: BriefcaseBusiness,
                  },
              ]
            : []),
        ...(can('submit applications')
            ? [
                  {
                      title: 'My applications',
                      href: '/applications',
                      icon: ClipboardList,
                  },
                  {
                      title: 'My profile',
                      href: '/applicant/profile',
                      icon: GraduationCap,
                  },
              ]
            : []),
        ...(can('manage departments')
            ? [
                  {
                      title: 'Departments',
                      href: '/admin/departments',
                      icon: Building2,
                  },
              ]
            : []),
        ...(can('manage users')
            ? [{ title: 'Users', href: '/admin/users', icon: UsersRound }]
            : []),
        ...(can('manage roles')
            ? [{ title: 'Roles', href: '/admin/roles', icon: ShieldCheck }]
            : []),
        ...(can('manage permissions')
            ? [
                  {
                      title: 'Permissions',
                      href: '/admin/permissions',
                      icon: ShieldCheck,
                  },
              ]
            : []),
        ...(can('create vacancies')
            ? [
                  {
                      title: 'Manage vacancies',
                      href: '/admin/vacancies',
                      icon: BriefcaseBusiness,
                  },
              ]
            : []),
        ...(can('review applications')
            ? [
                  {
                      title: 'Applications',
                      href: '/admin/applications',
                      icon: ClipboardList,
                  },
              ]
            : []),
        ...(can('view assigned interviews') || can('manage interview panels')
            ? [{ title: 'Interviews', href: '/interviews', icon: Video }]
            : []),
        ...(can('view reports')
            ? [
                  {
                      title: 'Reports',
                      href: '/admin/reports',
                      icon: FileBarChart2,
                  },
              ]
            : []),
        ...(can('view activity logs')
            ? [
                  {
                      title: 'Activity logs',
                      href: '/admin/activity-logs',
                      icon: Activity,
                  },
              ]
            : []),
        { title: 'Notifications', href: '/notifications', icon: Bell },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

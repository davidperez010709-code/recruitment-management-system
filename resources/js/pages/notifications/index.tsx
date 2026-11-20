import { Head, Link, router } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Pagination } from '@/components/rms/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Notification = {
    id: string;
    data: { title?: string; message?: string; url?: string };
    read_at: string | null;
    created_at: string;
};

export default function NotificationsIndex({
    notifications,
}: {
    notifications: {
        data: Notification[];
        links: { url: string | null; label: string; active: boolean }[];
    };
}) {
    return (
        <>
            <Head title="Notifications" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Notifications"
                    description="Recruitment updates and important account messages."
                    action={
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.post('/notifications/read-all')
                            }
                        >
                            <CheckCheck className="size-4" />
                            Mark all as read
                        </Button>
                    }
                />
                {notifications.data.length ? (
                    <div className="space-y-3">
                        {notifications.data.map((notification) => (
                            <Card
                                key={notification.id}
                                className={
                                    !notification.read_at
                                        ? 'border-primary/30 bg-primary/[0.02]'
                                        : ''
                                }
                            >
                                <CardContent className="flex items-start gap-3 p-4">
                                    <Bell className="mt-1 size-4 shrink-0 text-primary" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium">
                                            {notification.data.title ||
                                                'Recruitment update'}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {notification.data.message ||
                                                'You have a new update.'}
                                        </p>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {new Date(
                                                notification.created_at,
                                            ).toLocaleString()}
                                            {!notification.read_at
                                                ? ' · Unread'
                                                : ''}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={`/notifications/${notification.id}/read`}
                                            method="post"
                                            as="button"
                                        >
                                            Open
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="You're all caught up"
                        description="New recruitment notifications will appear here."
                    />
                )}
                <Pagination links={notifications.links} />
            </div>
        </>
    );
}
NotificationsIndex.layout = {
    breadcrumbs: [{ title: 'Notifications', href: '/notifications' }],
};

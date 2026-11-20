import { Link } from '@inertiajs/react';
import { EmptyState } from '@/components/rms/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentApplications } from './recent-applications';
import { UpcomingInterviews } from './upcoming-interviews';
import type { ApplicationRow, InterviewRow, NotificationRow } from './types';

export function ApplicantDashboard({
    applications,
    interviews,
    notifications,
}: {
    applications: ApplicationRow[];
    interviews: InterviewRow[];
    notifications: NotificationRow[];
}) {
    return (
        <div className="grid gap-4 xl:grid-cols-3">
            <RecentApplications applications={applications} />
            <UpcomingInterviews interviews={interviews} />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent notifications</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/notifications">View all</Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {notifications.length ? (
                        notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                href={notification.data.url || '/notifications'}
                                className="block rounded-lg border p-3 hover:bg-muted/50"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="font-medium">
                                        {notification.data.title ||
                                            'Recruitment update'}
                                    </p>
                                    {!notification.read_at ? (
                                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                                            New
                                        </span>
                                    ) : null}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {notification.data.message}
                                </p>
                            </Link>
                        ))
                    ) : (
                        <EmptyState
                            title="No notifications yet"
                            description="Recruitment updates will appear here."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

import { Head } from '@inertiajs/react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Pagination } from '@/components/rms/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Activity = {
    id: number;
    action: string;
    description: string;
    subject_type: string | null;
    subject_id: number | null;
    ip_address: string | null;
    created_at: string;
    user: { name: string; email: string } | null;
};

export default function ActivityLogIndex({
    logs,
}: {
    logs: {
        data: Activity[];
        links: { url: string | null; label: string; active: boolean }[];
    };
}) {
    return (
        <>
            <Head title="Activity logs" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Activity logs"
                    description="An audit trail of recruitment and administration actions."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Recent activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {logs.data.length ? (
                            logs.data.map((log) => (
                                <div
                                    key={log.id}
                                    className="grid gap-2 rounded-lg border p-4 md:grid-cols-[1fr_auto]"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {log.description}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {log.user
                                                ? `${log.user.name} (${log.user.email})`
                                                : 'System'}{' '}
                                            · {log.action.replaceAll('.', ' ')}
                                        </p>
                                        {log.subject_type ? (
                                            <p className="text-xs text-muted-foreground">
                                                {log.subject_type
                                                    .split('\\')
                                                    .pop()}{' '}
                                                #{log.subject_id}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="text-left text-xs text-muted-foreground md:text-right">
                                        <p>
                                            {new Date(
                                                log.created_at,
                                            ).toLocaleString()}
                                        </p>
                                        <p>
                                            {log.ip_address || 'IP unavailable'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState
                                title="No activity recorded"
                                description="Recruitment events will be listed here as they happen."
                            />
                        )}
                        <Pagination links={logs.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
ActivityLogIndex.layout = {
    breadcrumbs: [{ title: 'Activity logs', href: '/admin/activity-logs' }],
};

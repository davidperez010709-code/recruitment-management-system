import { Link } from '@inertiajs/react';
import { EmptyState } from '@/components/rms/empty-state';
import { StatusBadge } from '@/components/rms/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ApplicationRow } from './types';

export function RecentApplications({
    applications,
    admin = false,
}: {
    applications: ApplicationRow[];
    admin?: boolean;
}) {
    // The destination follows the viewer's audience; the server still authorizes each page.
    const listUrl = admin ? '/admin/applications' : '/applications';

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    {admin ? 'Recent applications' : 'My applications'}
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={listUrl}>View all</Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {applications.length ? (
                    applications.map((application) => (
                        <Link
                            key={application.id}
                            href={
                                admin
                                    ? `/admin/applications/${application.id}`
                                    : `/applications/${application.id}`
                            }
                            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50"
                        >
                            <div>
                                <p className="font-medium">
                                    {application.vacancy?.title || 'Vacancy'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {admin
                                        ? `${application.applicant?.name || 'Applicant'} · `
                                        : ''}
                                    {application.application_number} ·{' '}
                                    {new Date(
                                        application.submitted_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <StatusBadge status={application.status} />
                        </Link>
                    ))
                ) : (
                    <EmptyState
                        title="No applications yet"
                        description={
                            admin
                                ? 'New applications will appear here.'
                                : 'Your submitted applications will be listed here.'
                        }
                    />
                )}
            </CardContent>
        </Card>
    );
}

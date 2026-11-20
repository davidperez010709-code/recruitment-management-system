import { Head, Link } from '@inertiajs/react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Pagination } from '@/components/rms/pagination';
import { StatusBadge } from '@/components/rms/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Application = {
    id: number;
    application_number: string;
    status: string;
    submitted_at: string;
    vacancy: {
        title: string;
        reference_number: string;
        department: { name: string };
    };
    interviews: { id: number; interview_date: string; status: string }[];
};

export default function ApplicationIndex({
    applications,
}: {
    applications: {
        data: Application[];
        links: { url: string | null; label: string; active: boolean }[];
    };
}) {
    return (
        <>
            <Head title="My applications" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="My applications"
                    description="Track your submissions and recruitment progress."
                    action={
                        <Button asChild>
                            <Link href="/vacancies">Browse vacancies</Link>
                        </Button>
                    }
                />
                {applications.data.length ? (
                    <div className="space-y-3">
                        {applications.data.map((application) => (
                            <Card key={application.id}>
                                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                                    <div>
                                        <p className="font-semibold">
                                            {application.vacancy.title}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {
                                                application.vacancy.department
                                                    .name
                                            }{' '}
                                            · {application.application_number}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Submitted{' '}
                                            {new Date(
                                                application.submitted_at,
                                            ).toLocaleDateString()}
                                        </p>
                                        {application.interviews
                                            .filter((item) =>
                                                [
                                                    'SCHEDULED',
                                                    'RESCHEDULED',
                                                ].includes(item.status),
                                            )
                                            .map((item) => (
                                                <p
                                                    key={item.id}
                                                    className="mt-2 text-xs text-primary"
                                                >
                                                    Interview:{' '}
                                                    {new Date(
                                                        item.interview_date,
                                                    ).toLocaleString()}
                                                </p>
                                            ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge
                                            status={application.status}
                                        />
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={`/applications/${application.id}`}
                                            >
                                                View details
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No applications submitted"
                        description="When you apply for a vacancy, you can follow its status here."
                    />
                )}
                <Pagination links={applications.links} />
            </div>
        </>
    );
}
ApplicationIndex.layout = {
    breadcrumbs: [{ title: 'My applications', href: '/applications' }],
};

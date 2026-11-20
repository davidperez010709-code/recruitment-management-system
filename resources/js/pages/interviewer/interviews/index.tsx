import { Head, Link } from '@inertiajs/react';
import { CalendarPlus } from 'lucide-react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Pagination } from '@/components/rms/pagination';
import { StatusBadge } from '@/components/rms/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Interview = {
    id: number;
    interview_type: string;
    interview_date: string;
    location: string | null;
    status: string;
    application: {
        application_number: string;
        applicant: { name: string; email: string };
        vacancy: { title: string };
    };
    panel_members: { id: number; name: string }[];
};

export default function InterviewIndex({
    interviews,
    canSchedule,
}: {
    interviews: {
        data: Interview[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    canSchedule: boolean;
}) {
    return (
        <>
            <Head title="Interviews" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Interviews"
                    description="Assigned sessions, candidate details, and evaluation status."
                    action={
                        canSchedule ? (
                            <Button asChild>
                                <Link href="/admin/interviews/create">
                                    <CalendarPlus className="size-4" />
                                    Schedule interview
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Interview sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {interviews.data.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="p-3">Candidate</th>
                                            <th className="p-3">Vacancy</th>
                                            <th className="p-3">Session</th>
                                            <th className="p-3">Panel</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Open</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {interviews.data.map((interview) => (
                                            <tr
                                                key={interview.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="p-3">
                                                    <p className="font-medium">
                                                        {
                                                            interview
                                                                .application
                                                                .applicant.name
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {
                                                            interview
                                                                .application
                                                                .application_number
                                                        }
                                                    </p>
                                                </td>
                                                <td className="p-3">
                                                    {
                                                        interview.application
                                                            .vacancy.title
                                                    }
                                                </td>
                                                <td className="p-3">
                                                    <p>
                                                        {
                                                            interview.interview_type
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            interview.interview_date,
                                                        ).toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="max-w-48 p-3 text-xs">
                                                    {interview.panel_members
                                                        .map(
                                                            (member) =>
                                                                member.name,
                                                        )
                                                        .join(', ')}
                                                </td>
                                                <td className="p-3">
                                                    <StatusBadge
                                                        status={
                                                            interview.status
                                                        }
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/interviews/${interview.id}`}
                                                        >
                                                            Open
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState
                                title="No interviews assigned"
                                description="Assigned sessions will appear here when they are scheduled."
                            />
                        )}
                        <Pagination links={interviews.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
InterviewIndex.layout = {
    breadcrumbs: [{ title: 'Interviews', href: '/interviews' }],
};

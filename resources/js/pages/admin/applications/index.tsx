import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Pagination } from '@/components/rms/pagination';
import { StatusBadge } from '@/components/rms/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Application = {
    id: number;
    application_number: string;
    status: string;
    submitted_at: string;
    applicant: { name: string; email: string };
    vacancy: { title: string; reference_number: string };
    screenings: { result: string }[];
};

export default function AdminApplications({
    applications,
    vacancies,
    statuses,
    filters,
}: {
    applications: {
        data: Application[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    vacancies: { id: number; title: string }[];
    statuses: string[];
    filters: { search?: string; status?: string; vacancy_id?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [vacancyId, setVacancyId] = useState(filters.vacancy_id || '');

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(
            '/admin/applications',
            { search, status, vacancy_id: vacancyId },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Application review" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Applications"
                    description="Review candidate submissions and record screening outcomes."
                />
                <form
                    onSubmit={submit}
                    className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[1fr_220px_260px_auto]"
                >
                    <Input
                        placeholder="Search name, email, or application number"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className={selectClass}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        {statuses.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                    <select
                        className={selectClass}
                        value={vacancyId}
                        onChange={(e) => setVacancyId(e.target.value)}
                    >
                        <option value="">All vacancies</option>
                        {vacancies.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.title}
                            </option>
                        ))}
                    </select>
                    <Button>
                        <Search className="size-4" />
                        Filter
                    </Button>
                </form>
                <Card>
                    <CardHeader>
                        <CardTitle>Candidate submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {applications.data.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="p-3">Applicant</th>
                                            <th className="p-3">Vacancy</th>
                                            <th className="p-3">Application</th>
                                            <th className="p-3">Submitted</th>
                                            <th className="p-3">Screening</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Review</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.data.map(
                                            (application) => (
                                                <tr
                                                    key={application.id}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="p-3">
                                                        <p className="font-medium">
                                                            {
                                                                application
                                                                    .applicant
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                application
                                                                    .applicant
                                                                    .email
                                                            }
                                                        </p>
                                                    </td>
                                                    <td className="p-3">
                                                        {
                                                            application.vacancy
                                                                .title
                                                        }
                                                    </td>
                                                    <td className="p-3 font-mono text-xs">
                                                        {
                                                            application.application_number
                                                        }
                                                    </td>
                                                    <td className="p-3">
                                                        {new Date(
                                                            application.submitted_at,
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3">
                                                        {application
                                                            .screenings[0]
                                                            ?.result ||
                                                            'Not screened'}
                                                    </td>
                                                    <td className="p-3">
                                                        <StatusBadge
                                                            status={
                                                                application.status
                                                            }
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/applications/${application.id}`}
                                                            >
                                                                Open
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState
                                title="No applications found"
                                description="Try changing filters or wait for applicants to submit."
                            />
                        )}
                        <Pagination links={applications.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const selectClass =
    'h-9 w-full rounded-md border border-input bg-background px-3 text-sm';
AdminApplications.layout = {
    breadcrumbs: [{ title: 'Applications', href: '/admin/applications' }],
};

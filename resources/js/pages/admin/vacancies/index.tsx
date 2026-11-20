import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Pagination } from '@/components/rms/pagination';
import { StatusBadge } from '@/components/rms/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Vacancy = {
    id: number;
    title: string;
    reference_number: string;
    employment_category: string;
    application_deadline: string;
    status: string;
    applications_count: number;
    department: { name: string };
};

type Props = {
    vacancies: {
        data: Vacancy[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    departments: { id: number; name: string }[];
    statuses: string[];
    filters: { search?: string; status?: string; department_id?: string };
};

export default function VacanciesIndex({
    vacancies,
    departments,
    statuses,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [departmentId, setDepartmentId] = useState(
        filters.department_id || '',
    );

    return (
        <>
            <Head title="Manage vacancies" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Vacancies"
                    description="Create, publish, and close recruitment opportunities."
                    action={
                        <Button asChild>
                            <Link href="/admin/vacancies/create">
                                <Plus className="size-4" />
                                New vacancy
                            </Link>
                        </Button>
                    }
                />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Vacancy register</CardTitle>
                        <form
                            className="flex gap-2"
                            onSubmit={(event) => {
                                event.preventDefault();
                                router.get(
                                    '/admin/vacancies',
                                    {
                                        search,
                                        status,
                                        department_id: departmentId,
                                    },
                                    { preserveState: true, replace: true },
                                );
                            }}
                        >
                            <Input
                                aria-label="Search vacancies"
                                placeholder="Search position"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select
                                className={selectClass}
                                aria-label="Filter by status"
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
                                aria-label="Filter by department"
                                value={departmentId}
                                onChange={(e) =>
                                    setDepartmentId(e.target.value)
                                }
                            >
                                <option value="">All departments</option>
                                {departments.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            <Button variant="outline">
                                <Search className="size-4" />
                                Filter
                            </Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        {vacancies.data.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="p-3">Position</th>
                                            <th className="p-3">Department</th>
                                            <th className="p-3">Category</th>
                                            <th className="p-3">Deadline</th>
                                            <th className="p-3">
                                                Applications
                                            </th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vacancies.data.map((vacancy) => (
                                            <tr
                                                key={vacancy.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="p-3">
                                                    <p className="font-medium">
                                                        {vacancy.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {
                                                            vacancy.reference_number
                                                        }
                                                    </p>
                                                </td>
                                                <td className="p-3">
                                                    {vacancy.department.name}
                                                </td>
                                                <td className="p-3">
                                                    {
                                                        vacancy.employment_category
                                                    }
                                                </td>
                                                <td className="p-3">
                                                    {new Date(
                                                        vacancy.application_deadline,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="p-3">
                                                    {vacancy.applications_count}
                                                </td>
                                                <td className="p-3">
                                                    <StatusBadge
                                                        status={vacancy.status}
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/vacancies/${vacancy.id}/edit`}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        {vacancy.status ===
                                                        'DRAFT' ? (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (
                                                                        window.confirm(
                                                                            'Publish this vacancy?',
                                                                        )
                                                                    )
                                                                        router.post(
                                                                            `/admin/vacancies/${vacancy.id}/publish`,
                                                                        );
                                                                }}
                                                            >
                                                                Publish
                                                            </Button>
                                                        ) : null}
                                                        {vacancy.status ===
                                                        'PUBLISHED' ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (
                                                                        window.confirm(
                                                                            'Close applications for this vacancy?',
                                                                        )
                                                                    )
                                                                        router.post(
                                                                            `/admin/vacancies/${vacancy.id}/close`,
                                                                        );
                                                                }}
                                                            >
                                                                Close
                                                            </Button>
                                                        ) : null}
                                                        {vacancy.status ===
                                                            'PUBLISHED' ||
                                                        vacancy.status ===
                                                            'DRAFT' ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (
                                                                        window.confirm(
                                                                            vacancy.status ===
                                                                                'DRAFT'
                                                                                ? 'Delete this draft vacancy?'
                                                                                : 'Cancel this published vacancy?',
                                                                        )
                                                                    ) {
                                                                        if (
                                                                            vacancy.status ===
                                                                            'DRAFT'
                                                                        ) {
                                                                            router.delete(
                                                                                `/admin/vacancies/${vacancy.id}`,
                                                                            );
                                                                        } else {
                                                                            router.post(
                                                                                `/admin/vacancies/${vacancy.id}/cancel`,
                                                                            );
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {vacancy.status ===
                                                                'DRAFT'
                                                                    ? 'Delete draft'
                                                                    : 'Cancel'}
                                                            </Button>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState
                                title="No vacancies yet"
                                description="Create a draft vacancy to begin the recruitment workflow."
                            />
                        )}
                        <Pagination links={vacancies.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

VacanciesIndex.layout = {
    breadcrumbs: [{ title: 'Vacancies', href: '/admin/vacancies' }],
};

const selectClass =
    'h-9 rounded-md border border-input bg-background px-3 text-sm';

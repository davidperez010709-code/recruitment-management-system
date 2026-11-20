import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Pagination } from '@/components/rms/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Vacancy = {
    id: number;
    title: string;
    reference_number: string;
    employment_category: string;
    job_type: string;
    location: string;
    application_deadline: string;
    department: { name: string };
    requirements_count: number;
};

export default function VacancyIndex({
    vacancies,
    appliedVacancyIds,
    filters,
}: {
    vacancies: {
        data: Vacancy[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    appliedVacancyIds: number[];
    filters: { search?: string; category?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(
            '/vacancies',
            { search, category },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Browse vacancies" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Available vacancies"
                    description="Explore current academic and professional opportunities."
                />
                <form
                    onSubmit={submit}
                    className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_220px_auto]"
                >
                    <Input
                        aria-label="Search vacancies"
                        placeholder="Search by position title"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        aria-label="Employment category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option value="">All categories</option>
                        {[
                            'Academic',
                            'Administrative',
                            'Technical',
                            'Non-academic',
                        ].map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                    <Button>
                        <Search className="size-4" />
                        Search
                    </Button>
                </form>
                {vacancies.data.length ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {vacancies.data.map((vacancy) => (
                            <Card
                                key={vacancy.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardContent className="space-y-4 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-medium tracking-wide text-primary uppercase">
                                                {vacancy.employment_category}
                                            </p>
                                            <h2 className="mt-1 text-lg font-semibold">
                                                {vacancy.title}
                                            </h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {vacancy.department.name} ·{' '}
                                                {vacancy.location}
                                            </p>
                                        </div>
                                        <span className="rounded-md bg-muted px-2 py-1 text-xs">
                                            {vacancy.job_type}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                                        <span>
                                            Ref: {vacancy.reference_number}
                                        </span>
                                        <span>
                                            {vacancy.requirements_count} listed
                                            requirements
                                        </span>
                                        <span>
                                            Deadline{' '}
                                            {new Date(
                                                vacancy.application_deadline,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 border-t pt-4">
                                        <span className="text-sm font-medium">
                                            {appliedVacancyIds.includes(
                                                vacancy.id,
                                            )
                                                ? 'Application submitted'
                                                : 'Applications are open'}
                                        </span>
                                        <Button
                                            variant={
                                                appliedVacancyIds.includes(
                                                    vacancy.id,
                                                )
                                                    ? 'outline'
                                                    : 'default'
                                            }
                                            asChild
                                        >
                                            <Link
                                                href={`/vacancies/${vacancy.id}`}
                                            >
                                                {appliedVacancyIds.includes(
                                                    vacancy.id,
                                                )
                                                    ? 'View vacancy'
                                                    : 'View details'}
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No matching vacancies"
                        description="Try a different search or check back when new vacancies are published."
                    />
                )}
                <Pagination links={vacancies.links} />
            </div>
        </>
    );
}

VacancyIndex.layout = {
    breadcrumbs: [{ title: 'Vacancies', href: '/vacancies' }],
};

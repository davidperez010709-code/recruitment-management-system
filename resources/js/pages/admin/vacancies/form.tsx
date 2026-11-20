import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { VacancyRequirementsEditor } from '@/components/admin/vacancies/vacancy-requirements-editor';
import type { VacancyRequirement } from '@/components/admin/vacancies/vacancy-requirements-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Vacancy = {
    id: number;
    department_id: number;
    title: string;
    description: string;
    job_type: string;
    employment_category: string;
    location: string;
    number_of_positions: number;
    minimum_qualification: string;
    experience_required: string | null;
    salary_range: string | null;
    application_deadline: string;
    requirements: VacancyRequirement[];
};

export default function VacancyForm({
    vacancy,
    departments,
    categories,
}: {
    vacancy: Vacancy | null;
    departments: { id: number; name: string }[];
    categories: string[];
}) {
    const form = useForm({
        department_id: vacancy?.department_id ?? '',
        title: vacancy?.title ?? '',
        description: vacancy?.description ?? '',
        job_type: vacancy?.job_type ?? 'Full-time',
        employment_category:
            vacancy?.employment_category ?? categories[0] ?? 'Academic',
        location: vacancy?.location ?? 'Ibadan, Nigeria',
        number_of_positions: vacancy?.number_of_positions ?? 1,
        minimum_qualification: vacancy?.minimum_qualification ?? '',
        experience_required: vacancy?.experience_required ?? '',
        salary_range: vacancy?.salary_range ?? '',
        application_deadline: vacancy?.application_deadline?.slice(0, 10) ?? '',
        requirements: vacancy?.requirements ?? [],
    });

    // Keep the nested list immutable so Inertia notices every requirement edit.
    function updateRequirement(
        index: number,
        changes: Partial<VacancyRequirement>,
    ) {
        form.setData(
            'requirements',
            form.data.requirements.map((item, itemIndex) =>
                itemIndex === index ? { ...item, ...changes } : item,
            ),
        );
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (vacancy)
            form.put(`/admin/vacancies/${vacancy.id}`, {
                onSuccess: () => window.location.assign('/admin/vacancies'),
            });
        else
            form.post('/admin/vacancies', {
                onSuccess: () => window.location.assign('/admin/vacancies'),
            });
    }

    return (
        <>
            <Head title={vacancy ? 'Edit vacancy' : 'Create vacancy'} />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/vacancies">
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {vacancy ? 'Edit vacancy' : 'Create vacancy'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Vacancies are saved as drafts until published.
                        </p>
                    </div>
                </div>
                <form onSubmit={submit} className="space-y-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Position details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <label className="space-y-1.5 text-sm">
                                Position title
                                <Input
                                    value={form.data.title}
                                    onChange={(e) =>
                                        form.setData('title', e.target.value)
                                    }
                                />
                                {form.errors.title ? (
                                    <ErrorText text={form.errors.title} />
                                ) : null}
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Department
                                <select
                                    className={selectClass}
                                    value={form.data.department_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'department_id',
                                            Number(e.target.value),
                                        )
                                    }
                                >
                                    <option value="">Choose department</option>
                                    {departments.map((department) => (
                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.department_id ? (
                                    <ErrorText
                                        text={form.errors.department_id}
                                    />
                                ) : null}
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Employment category
                                <select
                                    className={selectClass}
                                    value={form.data.employment_category}
                                    onChange={(e) =>
                                        form.setData(
                                            'employment_category',
                                            e.target.value,
                                        )
                                    }
                                >
                                    {categories.map((category) => (
                                        <option key={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Job type
                                <select
                                    className={selectClass}
                                    value={form.data.job_type}
                                    onChange={(e) =>
                                        form.setData('job_type', e.target.value)
                                    }
                                >
                                    {[
                                        'Full-time',
                                        'Part-time',
                                        'Fixed-term',
                                        'Contract',
                                    ].map((type) => (
                                        <option key={type}>{type}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Location
                                <Input
                                    value={form.data.location}
                                    onChange={(e) =>
                                        form.setData('location', e.target.value)
                                    }
                                />
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Number of positions
                                <Input
                                    type="number"
                                    min={1}
                                    value={form.data.number_of_positions}
                                    onChange={(e) =>
                                        form.setData(
                                            'number_of_positions',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </label>
                            <label className="space-y-1.5 text-sm md:col-span-2">
                                Description
                                <textarea
                                    className={textareaClass}
                                    rows={6}
                                    value={form.data.description}
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                                {form.errors.description ? (
                                    <ErrorText text={form.errors.description} />
                                ) : null}
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Minimum qualification
                                <Input
                                    value={form.data.minimum_qualification}
                                    onChange={(e) =>
                                        form.setData(
                                            'minimum_qualification',
                                            e.target.value,
                                        )
                                    }
                                />
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Experience required
                                <Input
                                    value={form.data.experience_required}
                                    onChange={(e) =>
                                        form.setData(
                                            'experience_required',
                                            e.target.value,
                                        )
                                    }
                                />
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Salary range
                                <Input
                                    value={form.data.salary_range}
                                    onChange={(e) =>
                                        form.setData(
                                            'salary_range',
                                            e.target.value,
                                        )
                                    }
                                />
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Application deadline
                                <Input
                                    type="date"
                                    min={new Date().toISOString().slice(0, 10)}
                                    value={form.data.application_deadline}
                                    onChange={(e) =>
                                        form.setData(
                                            'application_deadline',
                                            e.target.value,
                                        )
                                    }
                                />
                                {form.errors.application_deadline ? (
                                    <ErrorText
                                        text={form.errors.application_deadline}
                                    />
                                ) : null}
                            </label>
                        </CardContent>
                    </Card>

                    <VacancyRequirementsEditor
                        requirements={form.data.requirements}
                        onAdd={() =>
                            form.setData('requirements', [
                                ...form.data.requirements,
                                {
                                    requirement: '',
                                    requirement_type: 'qualification',
                                    is_mandatory: true,
                                },
                            ])
                        }
                        onChange={updateRequirement}
                        onRemove={(index) =>
                            form.setData(
                                'requirements',
                                form.data.requirements.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                ),
                            )
                        }
                    />

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/vacancies">Cancel</Link>
                        </Button>
                        <Button disabled={form.processing}>
                            {form.processing ? 'Saving…' : 'Save draft'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

const selectClass =
    'h-9 w-full rounded-md border border-input bg-background px-3 text-sm';
const textareaClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';
function ErrorText({ text }: { text: string }) {
    return <span className="block text-xs text-destructive">{text}</span>;
}

VacancyForm.layout = {
    breadcrumbs: [
        { title: 'Vacancies', href: '/admin/vacancies' },
        { title: 'Edit', href: '/admin/vacancies/create' },
    ],
};

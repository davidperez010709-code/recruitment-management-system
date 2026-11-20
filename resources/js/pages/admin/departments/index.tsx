import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Pagination } from '@/components/rms/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Department = {
    id: number;
    name: string;
    code: string;
    description: string | null;
    head_of_department: string | null;
    is_active: boolean;
    users_count: number;
    vacancies_count: number;
};

type Props = {
    departments: {
        data: Department[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string };
};

export default function DepartmentsIndex({ departments, filters }: Props) {
    const [editing, setEditing] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const form = useForm({
        name: '',
        code: '',
        description: '',
        head_of_department: '',
        is_active: true,
    });

    function edit(department: Department) {
        setEditing(department.id);
        form.setData({
            name: department.name,
            code: department.code,
            description: department.description || '',
            head_of_department: department.head_of_department || '',
            is_active: department.is_active,
        });
    }

    function reset() {
        setEditing(null);
        form.reset();
        form.clearErrors();
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (editing) {
            form.put(`/admin/departments/${editing}`, { onSuccess: reset });
        } else {
            form.post('/admin/departments', { onSuccess: reset });
        }
    }

    return (
        <>
            <Head title="Departments" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Departments"
                    description="Maintain the departments used to organize recruitment vacancies."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {editing ? 'Edit department' : 'Add department'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid gap-4 md:grid-cols-2"
                        >
                            <label className="space-y-1.5 text-sm">
                                Department name
                                <Input
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                    aria-invalid={!!form.errors.name}
                                />
                                {form.errors.name ? (
                                    <span className="text-xs text-destructive">
                                        {form.errors.name}
                                    </span>
                                ) : null}
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Code
                                <Input
                                    value={form.data.code}
                                    onChange={(event) =>
                                        form.setData(
                                            'code',
                                            event.target.value.toUpperCase(),
                                        )
                                    }
                                    aria-invalid={!!form.errors.code}
                                />
                                {form.errors.code ? (
                                    <span className="text-xs text-destructive">
                                        {form.errors.code}
                                    </span>
                                ) : null}
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Head of department
                                <Input
                                    value={form.data.head_of_department}
                                    onChange={(event) =>
                                        form.setData(
                                            'head_of_department',
                                            event.target.value,
                                        )
                                    }
                                />
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Description
                                <Input
                                    value={form.data.description}
                                    onChange={(event) =>
                                        form.setData(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                />
                            </label>
                            {editing ? (
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(event) =>
                                            form.setData(
                                                'is_active',
                                                event.target.checked,
                                            )
                                        }
                                    />{' '}
                                    Active
                                </label>
                            ) : null}
                            <div className="flex items-center gap-2 md:col-span-2">
                                <Button disabled={form.processing}>
                                    <Plus className="size-4" />
                                    {editing
                                        ? 'Save changes'
                                        : 'Create department'}
                                </Button>
                                {editing ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={reset}
                                    >
                                        <X className="size-4" />
                                        Cancel
                                    </Button>
                                ) : null}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Department directory</CardTitle>
                        <form
                            className="flex gap-2"
                            onSubmit={(event) => {
                                event.preventDefault();
                                router.get(
                                    '/admin/departments',
                                    { search },
                                    { preserveState: true, replace: true },
                                );
                            }}
                        >
                            <Input
                                aria-label="Search departments"
                                placeholder="Search departments"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                            <Button variant="outline">Search</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        {departments.data.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="p-3">Department</th>
                                            <th className="p-3">Code</th>
                                            <th className="p-3">Head</th>
                                            <th className="p-3">Users</th>
                                            <th className="p-3">Vacancies</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departments.data.map((department) => (
                                            <tr
                                                key={department.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="p-3 font-medium">
                                                    {department.name}
                                                </td>
                                                <td className="p-3">
                                                    {department.code}
                                                </td>
                                                <td className="p-3">
                                                    {department.head_of_department ||
                                                        '—'}
                                                </td>
                                                <td className="p-3">
                                                    {department.users_count}
                                                </td>
                                                <td className="p-3">
                                                    {department.vacancies_count}
                                                </td>
                                                <td className="p-3">
                                                    {department.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Edit ${department.name}`}
                                                            onClick={() =>
                                                                edit(department)
                                                            }
                                                        >
                                                            <Pencil />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Delete ${department.name}`}
                                                            onClick={() => {
                                                                if (
                                                                    window.confirm(
                                                                        `Delete ${department.name}?`,
                                                                    )
                                                                )
                                                                    router.delete(
                                                                        `/admin/departments/${department.id}`,
                                                                    );
                                                            }}
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState
                                title="No departments found"
                                description="Add a department to start organizing your recruitment activity."
                            />
                        )}
                        <Pagination links={departments.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DepartmentsIndex.layout = {
    breadcrumbs: [{ title: 'Departments', href: '/admin/departments' }],
};

import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Pagination } from '@/components/rms/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    department_id: number | null;
    is_active: boolean;
    department: { name: string } | null;
    roles: { name: string }[];
};

export default function UsersIndex({
    users,
    departments,
    roles,
    canManageRoles,
    filters,
}: {
    users: {
        data: User[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    departments: { id: number; name: string }[];
    roles: string[];
    canManageRoles: boolean;
    filters: { search?: string; role?: string };
}) {
    const [editing, setEditing] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const form = useForm({
        name: '',
        email: '',
        phone: '',
        department_id: '' as number | '',
        is_active: true,
        password: '',
        roles: [] as string[],
    });

    function edit(user: User) {
        setEditing(user.id);
        form.setData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            department_id: user.department_id || '',
            is_active: user.is_active,
            password: '',
            roles: user.roles.map((role) => role.name),
        });
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (editing)
            form.put(`/admin/users/${editing}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditing(null);
                    form.reset();
                },
            });
        else
            form.post('/admin/users', {
                preserveScroll: true,
                onSuccess: () => form.reset(),
            });
    }

    function toggleRole(role: string) {
        form.setData(
            'roles',
            form.data.roles.includes(role)
                ? form.data.roles.filter((item) => item !== role)
                : [...form.data.roles, role],
        );
    }

    return (
        <>
            <Head title="User management" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="User management"
                    description="Create accounts, assign departments, and manage system access."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {editing ? 'Edit user' : 'Add user'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid gap-4 md:grid-cols-2"
                        >
                            <label className="space-y-1.5 text-sm">
                                Full name
                                <Input
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                />
                                {err(form.errors.name)}
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Email
                                <Input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData('email', e.target.value)
                                    }
                                />
                                {err(form.errors.email)}
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Phone
                                <Input
                                    value={form.data.phone}
                                    onChange={(e) =>
                                        form.setData('phone', e.target.value)
                                    }
                                />
                            </label>
                            <label className="space-y-1.5 text-sm">
                                Department
                                <select
                                    className={selectClass}
                                    value={form.data.department_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'department_id',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : '',
                                        )
                                    }
                                >
                                    <option value="">No department</option>
                                    {departments.map((department) => (
                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-1.5 text-sm">
                                {editing
                                    ? 'New password (optional)'
                                    : 'Temporary password'}
                                <Input
                                    type="password"
                                    autoComplete="new-password"
                                    value={form.data.password}
                                    onChange={(e) =>
                                        form.setData('password', e.target.value)
                                    }
                                />
                                {err(form.errors.password)}
                            </label>
                            <label className="flex items-center gap-2 pt-7 text-sm">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(e) =>
                                        form.setData(
                                            'is_active',
                                            e.target.checked,
                                        )
                                    }
                                />
                                Account active
                            </label>
                            {canManageRoles ? (
                                <fieldset className="space-y-2 md:col-span-2">
                                    <legend className="text-sm font-medium">
                                        Roles
                                    </legend>
                                    <div className="flex flex-wrap gap-3">
                                        {roles.map((role) => (
                                            <label
                                                key={role}
                                                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={form.data.roles.includes(
                                                        role,
                                                    )}
                                                    onChange={() =>
                                                        toggleRole(role)
                                                    }
                                                />
                                                {role.replaceAll('_', ' ')}
                                            </label>
                                        ))}
                                    </div>
                                    {err(form.errors.roles)}
                                </fieldset>
                            ) : null}
                            <div className="flex gap-2 md:col-span-2">
                                <Button disabled={form.processing}>
                                    {editing
                                        ? 'Save changes'
                                        : 'Create account'}
                                </Button>
                                {editing ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setEditing(null);
                                            form.reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                ) : null}
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Accounts</CardTitle>
                        <form
                            className="flex gap-2"
                            onSubmit={(event) => {
                                event.preventDefault();
                                router.get(
                                    '/admin/users',
                                    { search, role: roleFilter },
                                    { preserveState: true, replace: true },
                                );
                            }}
                        >
                            <Input
                                aria-label="Search users"
                                placeholder="Search name or email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select
                                className={selectClass}
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All roles</option>
                                {roles.map((role) => (
                                    <option key={role}>{role}</option>
                                ))}
                            </select>
                            <Button variant="outline">Filter</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        {users.data.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="p-3">User</th>
                                            <th className="p-3">Department</th>
                                            <th className="p-3">Roles</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="p-3">
                                                    <p className="font-medium">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </td>
                                                <td className="p-3">
                                                    {user.department?.name ||
                                                        '—'}
                                                </td>
                                                <td className="p-3">
                                                    {user.roles
                                                        .map((role) =>
                                                            role.name.replaceAll(
                                                                '_',
                                                                ' ',
                                                            ),
                                                        )
                                                        .join(', ') ||
                                                        'No role'}
                                                </td>
                                                <td className="p-3">
                                                    {user.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Edit ${user.name}`}
                                                            onClick={() =>
                                                                edit(user)
                                                            }
                                                        >
                                                            <Pencil />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Delete ${user.name}`}
                                                            onClick={() => {
                                                                if (
                                                                    window.confirm(
                                                                        `Delete or deactivate ${user.name}?`,
                                                                    )
                                                                )
                                                                    router.delete(
                                                                        `/admin/users/${user.id}`,
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
                                title="No users found"
                                description="Create the first user account."
                            />
                        )}
                        <Pagination links={users.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function err(value?: string) {
    return value ? (
        <span className="block text-xs text-destructive">{value}</span>
    ) : null;
}
const selectClass =
    'h-9 w-full rounded-md border border-input bg-background px-3 text-sm';
UsersIndex.layout = { breadcrumbs: [{ title: 'Users', href: '/admin/users' }] };

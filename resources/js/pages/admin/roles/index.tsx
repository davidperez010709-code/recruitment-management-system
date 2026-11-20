import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Role = {
    id: number;
    name: string;
    users_count: number;
    permissions: { id: number; name: string }[];
};

export default function RolesIndex({
    roles,
    permissions,
}: {
    roles: Role[];
    permissions: string[];
}) {
    const [editing, setEditing] = useState<number | null>(null);
    const form = useForm({ name: '', permissions: [] as string[] });

    function edit(role: Role) {
        setEditing(role.id);
        form.setData({
            name: role.name,
            permissions: role.permissions.map((permission) => permission.name),
        });
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setEditing(null);
                form.reset();
            },
        };
        if (editing) form.put(`/admin/roles/${editing}`, options);
        else form.post('/admin/roles', options);
    }

    function toggle(permission: string) {
        form.setData(
            'permissions',
            form.data.permissions.includes(permission)
                ? form.data.permissions.filter((item) => item !== permission)
                : [...form.data.permissions, permission],
        );
    }

    return (
        <>
            <Head title="Roles and permissions" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Roles and permissions"
                    description="Define role access using the system’s granular permissions."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {editing ? 'Edit role' : 'Create role'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <label className="block max-w-md space-y-1.5 text-sm">
                                Role name
                                <Input
                                    placeholder="HR_REVIEWER"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData(
                                            'name',
                                            e.target.value
                                                .toUpperCase()
                                                .replaceAll(' ', '_'),
                                        )
                                    }
                                />
                                {form.errors.name ? (
                                    <span className="text-xs text-destructive">
                                        {form.errors.name}
                                    </span>
                                ) : null}
                            </label>
                            <fieldset className="space-y-2">
                                <legend className="text-sm font-medium">
                                    Permissions
                                </legend>
                                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                                    {permissions.map((permission) => (
                                        <label
                                            key={permission}
                                            className="flex items-center gap-2 rounded-md border p-2.5 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.data.permissions.includes(
                                                    permission,
                                                )}
                                                onChange={() =>
                                                    toggle(permission)
                                                }
                                            />
                                            {permission}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                            <div className="flex gap-2">
                                <Button disabled={form.processing}>
                                    {editing ? 'Save role' : 'Create role'}
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
                    <CardHeader>
                        <CardTitle>System roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {roles.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Users</th>
                                            <th className="p-3">Permissions</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.map((role) => (
                                            <tr
                                                key={role.id}
                                                className="border-b align-top last:border-0"
                                            >
                                                <td className="p-3 font-medium">
                                                    {role.name}
                                                </td>
                                                <td className="p-3">
                                                    {role.users_count}
                                                </td>
                                                <td className="max-w-xl p-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {role.permissions.map(
                                                            (permission) => (
                                                                <span
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className="rounded bg-muted px-2 py-1 text-xs"
                                                                >
                                                                    {
                                                                        permission.name
                                                                    }
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={
                                                                role.name ===
                                                                'SUPER_ADMIN'
                                                            }
                                                            aria-label={`Edit ${role.name}`}
                                                            onClick={() =>
                                                                edit(role)
                                                            }
                                                        >
                                                            <Pencil />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={[
                                                                'SUPER_ADMIN',
                                                                'APPLICANT',
                                                            ].includes(
                                                                role.name,
                                                            )}
                                                            aria-label={`Delete ${role.name}`}
                                                            onClick={() => {
                                                                if (
                                                                    window.confirm(
                                                                        `Delete role ${role.name}?`,
                                                                    )
                                                                )
                                                                    router.delete(
                                                                        `/admin/roles/${role.id}`,
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
                                title="No roles found"
                                description="Run the role and permission seeder to create the base system roles."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RolesIndex.layout = { breadcrumbs: [{ title: 'Roles', href: '/admin/roles' }] };

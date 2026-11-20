import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/rms/empty-state';
import { PageHeader } from '@/components/rms/page-header';
import { Pagination } from '@/components/rms/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Permission = { id: number; name: string; roles_count: number };

export default function PermissionsIndex({
    permissions,
}: {
    permissions: {
        data: Permission[];
        links: { url: string | null; label: string; active: boolean }[];
    };
}) {
    const [editing, setEditing] = useState<number | null>(null);
    const form = useForm({ name: '' });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (editing)
            form.put(`/admin/permissions/${editing}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditing(null);
                    form.reset();
                },
            });
        else
            form.post('/admin/permissions', {
                preserveScroll: true,
                onSuccess: () => form.reset(),
            });
    }

    return (
        <>
            <Head title="Permissions" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Permissions"
                    description="Maintain the named capabilities that can be assigned to roles."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {editing
                                ? 'Rename permission'
                                : 'Create permission'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="flex flex-col gap-3 sm:flex-row"
                        >
                            <label className="flex-1 space-y-1.5 text-sm">
                                Permission name
                                <Input
                                    placeholder="review applications"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData(
                                            'name',
                                            e.target.value.toLowerCase(),
                                        )
                                    }
                                />
                                {form.errors.name ? (
                                    <span className="text-xs text-destructive">
                                        {form.errors.name}
                                    </span>
                                ) : null}
                            </label>
                            <div className="flex items-end gap-2">
                                <Button>
                                    {editing
                                        ? 'Save permission'
                                        : 'Add permission'}
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
                        <CardTitle>Permission catalogue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {permissions.data.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="p-3">Permission</th>
                                            <th className="p-3">
                                                Assigned roles
                                            </th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {permissions.data.map((permission) => (
                                            <tr
                                                key={permission.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="p-3 font-medium">
                                                    {permission.name}
                                                </td>
                                                <td className="p-3">
                                                    {permission.roles_count}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Rename ${permission.name}`}
                                                            onClick={() => {
                                                                setEditing(
                                                                    permission.id,
                                                                );
                                                                form.setData(
                                                                    'name',
                                                                    permission.name,
                                                                );
                                                            }}
                                                        >
                                                            <Pencil />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={
                                                                permission.roles_count >
                                                                0
                                                            }
                                                            aria-label={`Delete ${permission.name}`}
                                                            onClick={() => {
                                                                if (
                                                                    window.confirm(
                                                                        `Delete permission ${permission.name}?`,
                                                                    )
                                                                )
                                                                    router.delete(
                                                                        `/admin/permissions/${permission.id}`,
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
                                title="No permissions found"
                                description="Seed the system permissions before configuring roles."
                            />
                        )}
                        <Pagination links={permissions.links} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PermissionsIndex.layout = {
    breadcrumbs: [{ title: 'Permissions', href: '/admin/permissions' }],
};

import { router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FieldError } from './field-error';
import type { Qualification } from './types';

export function QualificationsSection({
    qualifications,
}: {
    qualifications: Qualification[];
}) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const form = useForm({
        institution_name: '',
        qualification: '',
        field_of_study: '',
        grade: '',
        graduation_year: new Date().getFullYear(),
    });

    function save(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
                form.reset();
            },
        };

        // Reuse one form for create and edit; the selected id determines the route verb.
        if (editingId !== null) {
            form.put(`/applicant/profile/qualifications/${editingId}`, options);
        } else {
            form.post('/applicant/profile/qualifications', options);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Academic qualifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <form
                    onSubmit={save}
                    className="grid gap-3 rounded-lg border p-4 md:grid-cols-2"
                >
                    <label className="space-y-1.5 text-sm">
                        Institution
                        <Input
                            value={form.data.institution_name}
                            onChange={(event) =>
                                form.setData(
                                    'institution_name',
                                    event.target.value,
                                )
                            }
                        />
                        <FieldError message={form.errors.institution_name} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Qualification
                        <Input
                            value={form.data.qualification}
                            onChange={(event) =>
                                form.setData(
                                    'qualification',
                                    event.target.value,
                                )
                            }
                        />
                        <FieldError message={form.errors.qualification} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Field of study
                        <Input
                            value={form.data.field_of_study}
                            onChange={(event) =>
                                form.setData(
                                    'field_of_study',
                                    event.target.value,
                                )
                            }
                        />
                        <FieldError message={form.errors.field_of_study} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Grade or result
                        <Input
                            value={form.data.grade}
                            onChange={(event) =>
                                form.setData('grade', event.target.value)
                            }
                        />
                        <FieldError message={form.errors.grade} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Graduation year
                        <Input
                            type="number"
                            min={1950}
                            max={new Date().getFullYear() + 10}
                            value={form.data.graduation_year}
                            onChange={(event) =>
                                form.setData(
                                    'graduation_year',
                                    Number(event.target.value),
                                )
                            }
                        />
                        <FieldError message={form.errors.graduation_year} />
                    </label>
                    <div className="flex items-end gap-2">
                        <Button disabled={form.processing}>
                            {editingId !== null
                                ? 'Update qualification'
                                : 'Add qualification'}
                        </Button>
                        {editingId !== null ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditingId(null);
                                    form.reset();
                                }}
                            >
                                Cancel
                            </Button>
                        ) : null}
                    </div>
                </form>
                {qualifications.length ? (
                    qualifications.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.qualification} · {item.field_of_study}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {item.institution_name} ·{' '}
                                    {item.graduation_year}
                                    {item.grade ? ` · ${item.grade}` : ''}
                                </p>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Edit qualification"
                                    onClick={() => {
                                        setEditingId(item.id);
                                        form.setData({
                                            institution_name:
                                                item.institution_name,
                                            qualification: item.qualification,
                                            field_of_study: item.field_of_study,
                                            grade: item.grade || '',
                                            graduation_year:
                                                item.graduation_year,
                                        });
                                    }}
                                >
                                    <Pencil />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Delete qualification"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                'Remove this qualification?',
                                            )
                                        )
                                            router.delete(
                                                `/applicant/profile/qualifications/${item.id}`,
                                                { preserveScroll: true },
                                            );
                                    }}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Add at least one qualification before applying for a
                        vacancy.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

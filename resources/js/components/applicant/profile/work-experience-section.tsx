import { router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FieldError } from './field-error';
import type { Experience } from './types';

export function WorkExperienceSection({
    experiences,
}: {
    experiences: Experience[];
}) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const form = useForm({
        organization: '',
        job_title: '',
        employment_type: '',
        start_date: '',
        end_date: '',
        responsibilities: '',
        is_current: false,
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
        if (editingId !== null) {
            form.put(`/applicant/profile/experiences/${editingId}`, options);
        } else {
            form.post('/applicant/profile/experiences', options);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Work experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <form
                    onSubmit={save}
                    className="grid gap-3 rounded-lg border p-4 md:grid-cols-2"
                >
                    <label className="space-y-1.5 text-sm">
                        Organization
                        <Input
                            value={form.data.organization}
                            onChange={(event) =>
                                form.setData('organization', event.target.value)
                            }
                        />
                        <FieldError message={form.errors.organization} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Job title
                        <Input
                            value={form.data.job_title}
                            onChange={(event) =>
                                form.setData('job_title', event.target.value)
                            }
                        />
                        <FieldError message={form.errors.job_title} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Employment type
                        <Input
                            value={form.data.employment_type}
                            onChange={(event) =>
                                form.setData(
                                    'employment_type',
                                    event.target.value,
                                )
                            }
                        />
                        <FieldError message={form.errors.employment_type} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Start date
                        <Input
                            type="date"
                            value={form.data.start_date}
                            onChange={(event) =>
                                form.setData('start_date', event.target.value)
                            }
                        />
                        <FieldError message={form.errors.start_date} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        End date
                        <Input
                            type="date"
                            disabled={form.data.is_current}
                            value={form.data.end_date}
                            onChange={(event) =>
                                form.setData('end_date', event.target.value)
                            }
                        />
                        <FieldError message={form.errors.end_date} />
                    </label>
                    <label className="flex items-center gap-2 pt-6 text-sm">
                        <input
                            type="checkbox"
                            checked={form.data.is_current}
                            onChange={(event) =>
                                form.setData('is_current', event.target.checked)
                            }
                        />
                        Current position
                    </label>
                    <label className="space-y-1.5 text-sm md:col-span-2">
                        Responsibilities
                        <textarea
                            className={textareaClass}
                            rows={3}
                            value={form.data.responsibilities}
                            onChange={(event) =>
                                form.setData(
                                    'responsibilities',
                                    event.target.value,
                                )
                            }
                        />
                        <FieldError message={form.errors.responsibilities} />
                    </label>
                    <div className="flex items-end gap-2">
                        <Button disabled={form.processing}>
                            {editingId !== null
                                ? 'Update experience'
                                : 'Add experience'}
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
                {experiences.length ? (
                    experiences.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.job_title} · {item.organization}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {item.start_date.slice(0, 10)} –{' '}
                                    {item.is_current
                                        ? 'Present'
                                        : item.end_date?.slice(0, 10) || '—'}
                                </p>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Edit work experience"
                                    onClick={() => {
                                        setEditingId(item.id);
                                        form.setData({
                                            organization: item.organization,
                                            job_title: item.job_title,
                                            employment_type:
                                                item.employment_type || '',
                                            start_date: item.start_date.slice(
                                                0,
                                                10,
                                            ),
                                            end_date:
                                                item.end_date?.slice(0, 10) ||
                                                '',
                                            responsibilities:
                                                item.responsibilities || '',
                                            is_current: item.is_current,
                                        });
                                    }}
                                >
                                    <Pencil />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Delete work experience"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                'Remove this work experience?',
                                            )
                                        )
                                            router.delete(
                                                `/applicant/profile/experiences/${item.id}`,
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
                        Add work history if you have relevant experience.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

const textareaClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

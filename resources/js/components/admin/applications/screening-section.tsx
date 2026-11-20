import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/rms/status-badge';
import type { AdminApplication } from './types';

export function ScreeningSection({
    application,
}: {
    application: AdminApplication;
}) {
    const form = useForm({
        screening_score: '',
        remarks: '',
        result: 'PENDING',
    });

    function save(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Each submission is an auditable screening record; backend rules govern valid transitions.
        form.post(`/admin/applications/${application.id}/screening`, {
            preserveScroll: true,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Screening</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={save} className="space-y-3">
                    <label className="block space-y-1 text-sm">
                        Result
                        <select
                            className={selectClass}
                            value={form.data.result}
                            onChange={(event) =>
                                form.setData('result', event.target.value)
                            }
                        >
                            <option value="PENDING">Pending</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="NOT_QUALIFIED">Not qualified</option>
                        </select>
                        {form.errors.result ? (
                            <FieldError message={form.errors.result} />
                        ) : null}
                    </label>
                    <label className="block space-y-1 text-sm">
                        Score (0–100)
                        <input
                            className={inputClass}
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={form.data.screening_score}
                            onChange={(event) =>
                                form.setData(
                                    'screening_score',
                                    event.target.value,
                                )
                            }
                        />
                        {form.errors.screening_score ? (
                            <FieldError message={form.errors.screening_score} />
                        ) : null}
                    </label>
                    <label className="block space-y-1 text-sm">
                        Remarks
                        <textarea
                            className={textareaClass}
                            rows={3}
                            value={form.data.remarks}
                            onChange={(event) =>
                                form.setData('remarks', event.target.value)
                            }
                        />
                        {form.errors.remarks ? (
                            <FieldError message={form.errors.remarks} />
                        ) : null}
                    </label>
                    <Button disabled={form.processing}>Record screening</Button>
                </form>
                {application.screenings.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-lg border p-3 text-sm"
                    >
                        <div className="flex justify-between gap-3">
                            <StatusBadge status={item.result} />
                            <span>
                                {item.screening_score
                                    ? `${item.screening_score} / 100`
                                    : 'No score'}
                            </span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap">
                            {item.remarks || 'No remarks.'}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            {item.screener.name} ·{' '}
                            {item.screened_at
                                ? new Date(item.screened_at).toLocaleString()
                                : ''}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function FieldError({ message }: { message?: string }) {
    return message ? (
        <span className="block text-xs text-destructive">{message}</span>
    ) : null;
}

const inputClass =
    'h-9 w-full rounded-md border border-input bg-background px-3 text-sm';
const selectClass = inputClass;
const textareaClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';

import { Link, router, useForm } from '@inertiajs/react';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/rms/status-badge';
import type { AdminApplication } from './types';

export function RecruitmentDecisionSection({
    application,
}: {
    application: AdminApplication;
}) {
    const form = useForm({ decision: 'SELECTED', remarks: '' });

    function saveDecision(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // The panel only appears after interview completion; the server still validates the transition.
        form.post(`/admin/applications/${application.id}/decision`, {
            preserveScroll: true,
        });
    }

    function shortlist() {
        if (window.confirm('Shortlist this applicant?')) {
            router.post(`/admin/applications/${application.id}/shortlist`);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recruitment decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {application.status === 'UNDER_REVIEW' &&
                application.screenings[0]?.result === 'QUALIFIED' ? (
                    <Button onClick={shortlist}>Shortlist applicant</Button>
                ) : null}
                {application.status === 'SHORTLISTED' ? (
                    <Button variant="outline" asChild>
                        <Link href="/admin/interviews/create">
                            <CalendarPlus className="size-4" />
                            Schedule interview
                        </Link>
                    </Button>
                ) : null}
                {application.status === 'INTERVIEW_COMPLETED' ? (
                    <form onSubmit={saveDecision} className="space-y-3">
                        <label className="block space-y-1 text-sm">
                            Decision
                            <select
                                className={selectClass}
                                value={form.data.decision}
                                onChange={(event) =>
                                    form.setData('decision', event.target.value)
                                }
                            >
                                <option value="SELECTED">Selected</option>
                                <option value="RESERVED">Reserved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            {form.errors.decision ? (
                                <FieldError message={form.errors.decision} />
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
                        <Button disabled={form.processing}>
                            Record final decision
                        </Button>
                    </form>
                ) : null}
                {application.recruitment_decision ? (
                    <div className="rounded-lg border p-3 text-sm">
                        <div className="flex items-center justify-between">
                            <StatusBadge
                                status={
                                    application.recruitment_decision.decision
                                }
                            />
                            <span>
                                {new Date(
                                    application.recruitment_decision
                                        .decision_date,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="mt-2">
                            Recorded by{' '}
                            {
                                application.recruitment_decision.decision_maker
                                    .name
                            }
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                            {application.recruitment_decision.remarks}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        A final decision can be recorded after interview
                        evaluations are complete.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function FieldError({ message }: { message?: string }) {
    return message ? (
        <span className="block text-xs text-destructive">{message}</span>
    ) : null;
}

const selectClass =
    'h-9 w-full rounded-md border border-input bg-background px-3 text-sm';
const textareaClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';

import { router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InterviewDetails, PanelMemberOption } from './types';

export function ManageInterview({
    interview,
    availablePanelMembers,
}: {
    interview: InterviewDetails;
    availablePanelMembers: PanelMemberOption[];
}) {
    const reschedule = useForm({
        interview_date: interview.interview_date.slice(0, 16),
        location: interview.location || '',
        instructions: interview.instructions || '',
    });
    const panel = useForm({
        panel_member_ids: interview.panel_members.map((member) => member.id),
    });

    return (
        <Card className="xl:col-span-2">
            <CardHeader>
                <CardTitle>Session management</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-2">
                <form
                    className="space-y-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        reschedule.patch(
                            `/admin/interviews/${interview.id}/reschedule`,
                            { preserveScroll: true },
                        );
                    }}
                >
                    <p className="text-sm font-medium">Reschedule session</p>
                    <label className="block space-y-1 text-sm">
                        Date and time
                        <input
                            className={inputClass}
                            type="datetime-local"
                            value={reschedule.data.interview_date}
                            onChange={(event) =>
                                reschedule.setData(
                                    'interview_date',
                                    event.target.value,
                                )
                            }
                        />
                        {reschedule.errors.interview_date ? (
                            <FieldError
                                message={reschedule.errors.interview_date}
                            />
                        ) : null}
                    </label>
                    <label className="block space-y-1 text-sm">
                        Location
                        <input
                            className={inputClass}
                            value={reschedule.data.location}
                            onChange={(event) =>
                                reschedule.setData(
                                    'location',
                                    event.target.value,
                                )
                            }
                        />
                        {reschedule.errors.location ? (
                            <FieldError message={reschedule.errors.location} />
                        ) : null}
                    </label>
                    <label className="block space-y-1 text-sm">
                        Instructions
                        <textarea
                            className={textareaClass}
                            rows={2}
                            value={reschedule.data.instructions}
                            onChange={(event) =>
                                reschedule.setData(
                                    'instructions',
                                    event.target.value,
                                )
                            }
                        />
                        {reschedule.errors.instructions ? (
                            <FieldError
                                message={reschedule.errors.instructions}
                            />
                        ) : null}
                    </label>
                    <Button variant="outline" disabled={reschedule.processing}>
                        Save new session time
                    </Button>
                </form>
                <form
                    className="space-y-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        panel.put(`/admin/interviews/${interview.id}/panel`, {
                            preserveScroll: true,
                        });
                    }}
                >
                    <p className="text-sm font-medium">Assigned panel</p>
                    <div className="max-h-48 space-y-2 overflow-y-auto">
                        {availablePanelMembers.map((member) => (
                            <label
                                key={member.id}
                                className="flex items-center gap-2 rounded-md border p-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={panel.data.panel_member_ids.includes(
                                        member.id,
                                    )}
                                    onChange={() =>
                                        panel.setData(
                                            'panel_member_ids',
                                            panel.data.panel_member_ids.includes(
                                                member.id,
                                            )
                                                ? panel.data.panel_member_ids.filter(
                                                      (id) => id !== member.id,
                                                  )
                                                : [
                                                      ...panel.data
                                                          .panel_member_ids,
                                                      member.id,
                                                  ],
                                        )
                                    }
                                />
                                <span>
                                    {member.name}
                                    <span className="block text-xs text-muted-foreground">
                                        {member.email}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                    {panel.errors.panel_member_ids ? (
                        <FieldError message={panel.errors.panel_member_ids} />
                    ) : null}
                    <Button variant="outline" disabled={panel.processing}>
                        Update panel
                    </Button>
                </form>
                <div className="lg:col-span-2">
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (window.confirm('Cancel this interview?')) {
                                router.post(
                                    `/admin/interviews/${interview.id}/cancel`,
                                );
                            }
                        }}
                    >
                        Cancel interview
                    </Button>
                </div>
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
const textareaClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { VacancyDetails } from './types';

export function VacancyDetails({ vacancy }: { vacancy: VacancyDetails }) {
    return (
        <div className="space-y-5">
            <Card>
                <CardHeader>
                    <CardTitle>Position overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-6">
                    <p className="whitespace-pre-wrap">{vacancy.description}</p>
                    <div className="grid gap-3 border-t pt-4 sm:grid-cols-2">
                        <Detail
                            label="Category"
                            value={vacancy.employment_category}
                        />
                        <Detail label="Job type" value={vacancy.job_type} />
                        <Detail
                            label="Positions"
                            value={String(vacancy.number_of_positions)}
                        />
                        <Detail
                            label="Minimum qualification"
                            value={vacancy.minimum_qualification}
                        />
                        <Detail
                            label="Experience"
                            value={
                                vacancy.experience_required || 'Not specified'
                            }
                        />
                        <Detail
                            label="Salary"
                            value={vacancy.salary_range || 'Not specified'}
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                    {vacancy.requirements.length ? (
                        <ul className="space-y-3">
                            {vacancy.requirements.map((requirement) => (
                                <li
                                    key={requirement.id}
                                    className="flex gap-3 text-sm"
                                >
                                    <span className="mt-0.5 size-2 shrink-0 rounded-full bg-primary" />
                                    <span>
                                        {requirement.requirement}
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            {requirement.requirement_type}
                                            {requirement.is_mandatory
                                                ? ' · required'
                                                : ' · preferred'}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No additional requirements were listed.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
                {label}
            </p>
            <p className="font-medium">{value}</p>
        </div>
    );
}

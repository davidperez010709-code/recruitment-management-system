import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InterviewDetails } from './types';

export function InterviewInformation({
    interview,
}: {
    interview: InterviewDetails;
}) {
    const { application } = interview;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Session details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p>
                        <span className="text-muted-foreground">Date:</span>{' '}
                        {new Date(interview.interview_date).toLocaleString()}
                    </p>
                    <p>
                        <span className="text-muted-foreground">Location:</span>{' '}
                        {interview.location || 'Not specified'}
                    </p>
                    <p>
                        <span className="text-muted-foreground">
                            Application:
                        </span>{' '}
                        {application.application_number}
                    </p>
                    <p>
                        <span className="text-muted-foreground">
                            Department:
                        </span>{' '}
                        {application.vacancy.department.name}
                    </p>
                    <div className="border-t pt-3">
                        <p className="font-medium">Instructions</p>
                        <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                            {interview.instructions ||
                                'No additional instructions.'}
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Candidate information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p>{application.applicant.email}</p>
                    <div>
                        <p className="font-medium">Cover letter</p>
                        <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                            {application.cover_letter ||
                                'No cover letter provided.'}
                        </p>
                    </div>
                    <div className="border-t pt-3">
                        <p className="mb-2 font-medium">Qualifications</p>
                        {application.applicant.applicant_profile?.qualifications
                            .length ? (
                            application.applicant.applicant_profile.qualifications.map(
                                (item, index) => (
                                    <p
                                        key={`${item.institution_name}-${index}`}
                                        className="mb-2"
                                    >
                                        {item.qualification} in{' '}
                                        {item.field_of_study}
                                        <span className="block text-xs text-muted-foreground">
                                            {item.institution_name} ·{' '}
                                            {item.graduation_year}
                                        </span>
                                    </p>
                                ),
                            )
                        ) : (
                            <p className="text-muted-foreground">
                                No qualifications listed.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

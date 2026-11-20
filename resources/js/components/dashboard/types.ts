export type ApplicationRow = {
    id: number;
    application_number: string;
    status: string;
    submitted_at: string;
    applicant?: { name: string };
    vacancy?: { id?: number; title: string; reference_number?: string };
};

export type InterviewRow = {
    id: number;
    interview_type: string;
    interview_date: string;
    status: string;
    application: { applicant: { name: string }; vacancy: { title: string } };
};

export type NotificationRow = {
    id: string;
    data: { title?: string; message?: string; url?: string };
    read_at: string | null;
    created_at: string;
};

export type EvaluationRow = {
    id: number;
    overall_score: number | string;
    recommendation: string;
    interview: { application: { vacancy: { title: string } } };
};

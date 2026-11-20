export type AdminApplication = {
    id: number;
    application_number: string;
    status: string;
    submitted_at: string;
    cover_letter: string | null;
    applicant: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
        applicant_profile: {
            date_of_birth: string | null;
            gender: string | null;
            address: string | null;
            state_of_origin: string | null;
            nationality: string;
            qualifications: {
                id: number;
                qualification: string;
                field_of_study: string;
                institution_name: string;
                grade: string | null;
                graduation_year: number;
            }[];
            work_experiences: {
                id: number;
                organization: string;
                job_title: string;
                responsibilities: string | null;
                start_date: string;
                end_date: string | null;
                is_current: boolean;
            }[];
        } | null;
    };
    vacancy: {
        title: string;
        reference_number: string;
        department: { name: string };
    };
    documents: {
        id: number;
        document_name: string;
        document_type: string;
        file_size: number;
    }[];
    screenings: {
        id: number;
        result: string;
        screening_score: string | null;
        remarks: string | null;
        screened_at: string | null;
        screener: { name: string };
    }[];
    interviews: {
        id: number;
        interview_type: string;
        interview_date: string;
        status: string;
        panel_members: { id: number; name: string }[];
        evaluations: {
            id: number;
            overall_score: string;
            recommendation: string;
            comments: string | null;
            evaluator: { name: string };
        }[];
    }[];
    recruitment_decision: {
        decision: string;
        remarks: string | null;
        decision_date: string;
        decision_maker: { name: string };
    } | null;
};

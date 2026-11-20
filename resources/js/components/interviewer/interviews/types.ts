export type InterviewDetails = {
    id: number;
    interview_type: string;
    interview_date: string;
    location: string | null;
    instructions: string | null;
    status: string;
    application_id: number;
    application: {
        application_number: string;
        cover_letter: string | null;
        applicant: {
            name: string;
            email: string;
            applicant_profile: {
                qualifications: {
                    qualification: string;
                    field_of_study: string;
                    institution_name: string;
                    graduation_year: number;
                }[];
            } | null;
        };
        vacancy: {
            title: string;
            reference_number: string;
            department: { name: string };
        };
    };
    panel_members: { id: number; name: string; email: string }[];
    evaluations: {
        id: number;
        evaluator: { name: string };
        overall_score: string;
        recommendation: string;
        comments: string | null;
    }[];
};

export type PanelMemberOption = { id: number; name: string; email: string };

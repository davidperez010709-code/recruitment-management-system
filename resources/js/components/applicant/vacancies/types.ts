export type VacancyRequirement = {
    id: number;
    requirement: string;
    requirement_type: string;
    is_mandatory: boolean;
};

export type VacancyDetails = {
    id: number;
    title: string;
    reference_number: string;
    description: string;
    employment_category: string;
    job_type: string;
    location: string;
    number_of_positions: number;
    minimum_qualification: string;
    experience_required: string | null;
    salary_range: string | null;
    application_deadline: string;
    department: { name: string };
    requirements: VacancyRequirement[];
};

export type ApplicationDocumentType =
    | 'cv'
    | 'cover_letter'
    | 'qualification'
    | 'identity'
    | 'other';

export type ApplicationDocumentDraft = {
    id: number;
    type: ApplicationDocumentType;
    file?: File;
};

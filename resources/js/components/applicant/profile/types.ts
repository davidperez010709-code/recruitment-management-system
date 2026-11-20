export type Qualification = {
    id: number;
    institution_name: string;
    qualification: string;
    field_of_study: string;
    grade: string | null;
    graduation_year: number;
};

export type Experience = {
    id: number;
    organization: string;
    job_title: string;
    employment_type: string | null;
    start_date: string;
    end_date: string | null;
    responsibilities: string | null;
    is_current: boolean;
};

export type ApplicantProfile = {
    date_of_birth: string | null;
    gender: string | null;
    address: string | null;
    state_of_origin: string | null;
    nationality: string;
    profile_photo: string | null;
    qualifications: Qualification[];
    work_experiences: Experience[];
};

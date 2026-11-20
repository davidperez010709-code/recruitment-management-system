import { Head } from '@inertiajs/react';
import { PersonalInformationForm } from '@/components/applicant/profile/personal-information-form';
import { ProfileProgressCard } from '@/components/applicant/profile/profile-progress-card';
import { QualificationsSection } from '@/components/applicant/profile/qualifications-section';
import type { ApplicantProfile } from '@/components/applicant/profile/types';
import { WorkExperienceSection } from '@/components/applicant/profile/work-experience-section';
import { PageHeader } from '@/components/rms/page-header';

type Props = {
    profile: ApplicantProfile;
    phone: string | null;
    completion: number;
};

/** Page composition only; each profile area owns its own form and edit state. */
export default function ApplicantProfileEdit({
    profile,
    phone,
    completion,
}: Props) {
    return (
        <>
            <Head title="My profile" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Applicant profile"
                    description="Keep your personal information and career history current."
                />
                <ProfileProgressCard
                    profile={profile}
                    completion={completion}
                />
                <PersonalInformationForm profile={profile} phone={phone} />
                <QualificationsSection
                    qualifications={profile.qualifications}
                />
                <WorkExperienceSection experiences={profile.work_experiences} />
            </div>
        </>
    );
}

ApplicantProfileEdit.layout = {
    breadcrumbs: [{ title: 'My profile', href: '/applicant/profile' }],
};

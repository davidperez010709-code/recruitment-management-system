import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ApplicationForm } from '@/components/applicant/vacancies/application-form';
import type { VacancyDetails as Vacancy } from '@/components/applicant/vacancies/types';
import { VacancyDetails } from '@/components/applicant/vacancies/vacancy-details';
import { PageHeader } from '@/components/rms/page-header';
import { Button } from '@/components/ui/button';

/** The route page frames vacancy information and delegates the application form. */
export default function VacancyShow({
    vacancy,
    hasApplied,
}: {
    vacancy: Vacancy;
    hasApplied: boolean;
}) {
    return (
        <>
            <Head title={vacancy.title} />
            <div className="space-y-6 p-4 md:p-6">
                <Button variant="ghost" asChild>
                    <Link href="/vacancies">
                        <ArrowLeft className="size-4" />
                        Back to vacancies
                    </Link>
                </Button>
                <PageHeader
                    title={vacancy.title}
                    description={`${vacancy.department.name} · ${vacancy.location} · ${vacancy.reference_number}`}
                />
                <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                    <VacancyDetails vacancy={vacancy} />
                    <ApplicationForm
                        vacancy={vacancy}
                        hasApplied={hasApplied}
                    />
                </div>
            </div>
        </>
    );
}

VacancyShow.layout = {
    breadcrumbs: [
        { title: 'Vacancies', href: '/vacancies' },
        { title: 'Details', href: '#' },
    ],
};

import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BriefcaseBusiness,
    GraduationCap,
    ShieldCheck,
    UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlights = [
    {
        icon: BriefcaseBusiness,
        title: 'Find opportunities',
        text: 'Browse current academic, administrative, technical, and non-academic vacancies.',
    },
    {
        icon: UsersRound,
        title: 'Follow your application',
        text: 'Submit your details securely and see each recruitment stage in one place.',
    },
    {
        icon: ShieldCheck,
        title: 'A clear process',
        text: 'Receive interview invitations and recruitment updates through your account.',
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="Recruitment Management System" />
            <main className="min-h-screen bg-slate-50 text-slate-900">
                <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                        aria-label="Recruitment Management System home"
                    >
                        <span className="grid size-11 place-items-center rounded-xl bg-blue-950 text-white">
                            <GraduationCap className="size-6" />
                        </span>
                        <span>
                            <span className="block font-semibold tracking-tight">
                                Recruitment RMS
                            </span>
                            <span className="block text-xs text-slate-500">
                                University recruitment portal
                            </span>
                        </span>
                    </Link>
                    <nav className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Sign in</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Create account</Link>
                        </Button>
                    </nav>
                </header>

                <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-12 pb-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20 lg:pb-24">
                    <div className="max-w-2xl">
                        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium tracking-wide text-cyan-900 uppercase">
                            <span className="size-2 rounded-full bg-cyan-600" />
                            Academic recruitment portal
                        </p>
                        <h1 className="text-4xl leading-tight font-semibold tracking-tight text-blue-950 sm:text-5xl lg:text-6xl">
                            A clearer path from vacancy to appointment.
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                            Explore open roles, submit an application, and
                            follow recruitment updates in one secure portal.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button size="lg" asChild>
                                <Link href="/register">
                                    Get started{' '}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/login">
                                    Sign in to your account
                                </Link>
                            </Button>
                        </div>
                        <p className="mt-4 text-xs text-slate-500">
                            Academic prototype for the University of Ibadan case
                            study. No official university logo is used.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-cyan-100 via-blue-100 to-slate-100 blur-2xl" />
                        <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-8">
                            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Candidate workspace
                                    </p>
                                    <h2 className="mt-1 text-xl font-semibold">
                                        Your next step, at a glance
                                    </h2>
                                </div>
                                <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-900">
                                    <GraduationCap className="size-5" />
                                </span>
                            </div>
                            <div className="space-y-4 py-6">
                                {[
                                    'Complete your applicant profile',
                                    'Browse published vacancies',
                                    'Track application and interview updates',
                                ].map((item, index) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-4 rounded-xl border border-slate-100 p-4"
                                    >
                                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cyan-50 text-sm font-semibold text-cyan-900">
                                            {index + 1}
                                        </span>
                                        <p className="text-sm font-medium text-slate-700">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="secondary"
                                className="w-full"
                                asChild
                            >
                                <Link href="/register">
                                    Create your applicant account{' '}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="border-t border-slate-200 bg-white">
                    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3">
                        {highlights.map(({ icon: Icon, title, text }) => (
                            <article key={title} className="flex gap-4">
                                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-900">
                                    <Icon className="size-5" />
                                </span>
                                <div>
                                    <h3 className="font-semibold">{title}</h3>
                                    <p className="mt-1.5 text-sm leading-6 text-slate-600">
                                        {text}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
                <footer className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-slate-500 sm:px-8">
                    Recruitment Management System · Academic prototype
                </footer>
            </main>
        </>
    );
}

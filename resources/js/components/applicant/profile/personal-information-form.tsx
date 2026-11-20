import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FieldError } from './field-error';
import type { ApplicantProfile } from './types';

export function PersonalInformationForm({
    profile,
    phone,
}: {
    profile: ApplicantProfile;
    phone: string | null;
}) {
    const form = useForm({
        phone: phone || '',
        date_of_birth: profile.date_of_birth?.slice(0, 10) || '',
        gender: profile.gender || '',
        address: profile.address || '',
        state_of_origin: profile.state_of_origin || '',
        nationality: profile.nationality || 'Nigerian',
        profile_photo: null as File | null,
    });

    function save(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Multipart encoding is needed only when the applicant includes a new photo.
        form.put('/applicant/profile', {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal information</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1.5 text-sm">
                        Phone
                        <Input
                            value={form.data.phone}
                            onChange={(event) =>
                                form.setData('phone', event.target.value)
                            }
                        />
                        <FieldError message={form.errors.phone} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Date of birth
                        <Input
                            type="date"
                            value={form.data.date_of_birth}
                            onChange={(event) =>
                                form.setData(
                                    'date_of_birth',
                                    event.target.value,
                                )
                            }
                        />
                        <FieldError message={form.errors.date_of_birth} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Gender
                        <select
                            className={selectClass}
                            value={form.data.gender}
                            onChange={(event) =>
                                form.setData('gender', event.target.value)
                            }
                        >
                            <option value="">Prefer not to say</option>
                            <option>Female</option>
                            <option>Male</option>
                            <option>Other</option>
                        </select>
                        <FieldError message={form.errors.gender} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        State of origin
                        <Input
                            value={form.data.state_of_origin}
                            onChange={(event) =>
                                form.setData(
                                    'state_of_origin',
                                    event.target.value,
                                )
                            }
                        />
                        <FieldError message={form.errors.state_of_origin} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Nationality
                        <Input
                            value={form.data.nationality}
                            onChange={(event) =>
                                form.setData('nationality', event.target.value)
                            }
                        />
                        <FieldError message={form.errors.nationality} />
                    </label>
                    <label className="space-y-1.5 text-sm">
                        Profile photo
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                form.setData(
                                    'profile_photo',
                                    event.target.files?.[0] || null,
                                )
                            }
                        />
                        <FieldError message={form.errors.profile_photo} />
                    </label>
                    <label className="space-y-1.5 text-sm md:col-span-2">
                        Residential address
                        <textarea
                            className={textareaClass}
                            rows={3}
                            value={form.data.address}
                            onChange={(event) =>
                                form.setData('address', event.target.value)
                            }
                        />
                        <FieldError message={form.errors.address} />
                    </label>
                    <div className="md:col-span-2">
                        <Button disabled={form.processing}>
                            Save personal information
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

const selectClass =
    'h-9 w-full rounded-md border border-input bg-background px-3 text-sm';
const textareaClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

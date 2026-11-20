import { UserRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ApplicantProfile } from './types';

export function ProfileProgressCard({
    profile,
    completion,
}: {
    profile: ApplicantProfile;
    completion: number;
}) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-5">
                <div className="grid size-14 place-items-center overflow-hidden rounded-full bg-primary/10 text-primary">
                    {profile.profile_photo ? (
                        <img
                            className="size-full object-cover"
                            src="/applicant/profile/photo"
                            alt="Profile"
                        />
                    ) : (
                        <UserRound className="size-7" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Profile completion</p>
                        <p className="text-sm font-semibold">{completion}%</p>
                    </div>
                    <div
                        className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-valuenow={completion}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Profile completion"
                    >
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${completion}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

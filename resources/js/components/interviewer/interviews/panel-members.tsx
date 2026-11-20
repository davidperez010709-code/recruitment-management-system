import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InterviewDetails } from './types';

export function PanelMembers({ interview }: { interview: InterviewDetails }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Panel members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {interview.panel_members.length ? (
                    interview.panel_members.map((member) => (
                        <div key={member.id} className="rounded-md border p-3">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {member.email}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No panel members assigned.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

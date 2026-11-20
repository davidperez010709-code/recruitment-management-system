import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export type VacancyRequirement = {
    requirement: string;
    requirement_type: string;
    is_mandatory: boolean;
};

type Props = {
    requirements: VacancyRequirement[];
    onAdd: () => void;
    onChange: (index: number, changes: Partial<VacancyRequirement>) => void;
    onRemove: (index: number) => void;
};

/** Keeps the repeatable requirement rows separate from the vacancy's core fields. */
export function VacancyRequirementsEditor({
    requirements,
    onAdd,
    onChange,
    onRemove,
}: Props) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Requirements</CardTitle>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAdd}
                >
                    <Plus className="size-4" />
                    Add requirement
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {requirements.length ? (
                    requirements.map((requirement, index) => (
                        <div
                            key={index}
                            className="grid gap-3 rounded-lg border p-3 md:grid-cols-[1fr_180px_auto_auto]"
                        >
                            <Input
                                aria-label="Requirement"
                                placeholder="Requirement"
                                value={requirement.requirement}
                                onChange={(event) =>
                                    onChange(index, {
                                        requirement: event.target.value,
                                    })
                                }
                            />
                            <Input
                                aria-label="Requirement type"
                                placeholder="Type"
                                value={requirement.requirement_type}
                                onChange={(event) =>
                                    onChange(index, {
                                        requirement_type: event.target.value,
                                    })
                                }
                            />
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={requirement.is_mandatory}
                                    onChange={(event) =>
                                        onChange(index, {
                                            is_mandatory: event.target.checked,
                                        })
                                    }
                                />
                                Mandatory
                            </label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Remove requirement"
                                onClick={() => onRemove(index)}
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Add eligibility requirements if this vacancy needs them.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

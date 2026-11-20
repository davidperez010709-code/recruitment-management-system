import { Link, useForm } from '@inertiajs/react';
import { Paperclip, Plus, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type {
    ApplicationDocumentDraft,
    ApplicationDocumentType,
    VacancyDetails,
} from './types';

export function ApplicationForm({
    vacancy,
    hasApplied,
}: {
    vacancy: VacancyDetails;
    hasApplied: boolean;
}) {
    const [documents, setDocuments] = useState<ApplicationDocumentDraft[]>([
        { id: 1, type: 'cv' },
    ]);
    const [nextDocumentId, setNextDocumentId] = useState(2);
    const form = useForm<{
        cover_letter: string;
        documents: { type: string; file: File }[];
    }>({ cover_letter: '', documents: [] });
    const errors = form.errors as Record<string, string | undefined>;

    function updateDocuments(next: ApplicationDocumentDraft[]) {
        setDocuments(next);
        // Keep the form payload in sync while omitting rows with no selected file.
        form.setData(
            'documents',
            next.flatMap(({ type, file }) => (file ? [{ type, file }] : [])),
        );
    }

    function addDocument() {
        updateDocuments([...documents, { id: nextDocumentId, type: 'other' }]);
        setNextDocumentId(nextDocumentId + 1);
    }

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // File attachments require a multipart request; the server validates each file again.
        form.post(`/vacancies/${vacancy.id}/applications`, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Apply for this role</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                    Application deadline:{' '}
                    {new Date(
                        vacancy.application_deadline,
                    ).toLocaleDateString()}
                </p>
                {hasApplied ? (
                    <div className="space-y-3">
                        <p className="text-sm">
                            You have already submitted an application for this
                            vacancy.
                        </p>
                        <Button variant="outline" asChild>
                            <Link href="/applications">
                                View my applications
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-4">
                        {errors.profile ? (
                            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                {errors.profile}{' '}
                                <Link
                                    className="underline"
                                    href="/applicant/profile"
                                >
                                    Complete profile
                                </Link>
                            </p>
                        ) : null}
                        {errors.application ? (
                            <p className="text-sm text-destructive">
                                {errors.application}
                            </p>
                        ) : null}
                        <label className="block space-y-1.5 text-sm">
                            Cover letter
                            <textarea
                                className="min-h-36 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={form.data.cover_letter}
                                onChange={(event) =>
                                    form.setData(
                                        'cover_letter',
                                        event.target.value,
                                    )
                                }
                                placeholder="Briefly explain your interest and suitability."
                            />
                            {errors.cover_letter ? (
                                <FieldError message={errors.cover_letter} />
                            ) : null}
                        </label>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium">
                                    Supporting documents{' '}
                                    <span className="font-normal text-muted-foreground">
                                        (PDF or Word, up to 10 MB each)
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    You may attach up to 12 documents.
                                </p>
                            </div>
                            {documents.map((document, index) => (
                                <div
                                    key={document.id}
                                    className="space-y-2 rounded-lg border p-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <select
                                            aria-label={`Document ${index + 1} type`}
                                            className={selectClass}
                                            value={document.type}
                                            onChange={(event) =>
                                                updateDocuments(
                                                    documents.map((item) =>
                                                        item.id === document.id
                                                            ? {
                                                                  ...item,
                                                                  type: event
                                                                      .target
                                                                      .value as ApplicationDocumentType,
                                                              }
                                                            : item,
                                                    ),
                                                )
                                            }
                                        >
                                            <option value="cv">
                                                Curriculum vitae
                                            </option>
                                            <option value="cover_letter">
                                                Cover letter
                                            </option>
                                            <option value="qualification">
                                                Qualification
                                            </option>
                                            <option value="identity">
                                                Identity document
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                        {documents.length > 1 ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Remove document"
                                                onClick={() =>
                                                    updateDocuments(
                                                        documents.filter(
                                                            (item) =>
                                                                item.id !==
                                                                document.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        ) : null}
                                    </div>
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        aria-label={`Choose document ${index + 1}`}
                                        onChange={(event) =>
                                            updateDocuments(
                                                documents.map((item) =>
                                                    item.id === document.id
                                                        ? {
                                                              ...item,
                                                              file: event.target
                                                                  .files?.[0],
                                                          }
                                                        : item,
                                                ),
                                            )
                                        }
                                    />
                                    {document.file ? (
                                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Paperclip className="size-3" />
                                            {document.file.name}
                                        </p>
                                    ) : null}
                                </div>
                            ))}
                            {Object.entries(errors)
                                .filter(([key]) => key.startsWith('documents'))
                                .map(([key, message]) => (
                                    <FieldError key={key} message={message} />
                                ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={documents.length >= 12}
                                onClick={addDocument}
                            >
                                <Plus className="size-4" />
                                Add a document
                            </Button>
                        </div>
                        <Button className="w-full" disabled={form.processing}>
                            <Send className="size-4" />
                            {form.processing
                                ? 'Submitting…'
                                : 'Submit application'}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

function FieldError({ message }: { message?: string }) {
    return message ? (
        <span className="block text-xs text-destructive">{message}</span>
    ) : null;
}

const selectClass =
    'h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm';

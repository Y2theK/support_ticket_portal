import { useForm } from '@inertiajs/react';
import type { SubmitEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';

type CommentFormProps = {
    isAgent?: boolean;
    postUrl: string;
};

export function CommentForm({ isAgent = false, postUrl }: CommentFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
        is_internal: false,
    });

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(postUrl, {
            preserveScroll: true,
            onSuccess: () => {
                reset('body');

                if (isAgent) {
                    setData('is_internal', false);
                }
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="comment-body">
                    {data.is_internal ? 'Internal note' : 'Public comment'}
                </Label>
                <textarea
                    id="comment-body"
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    placeholder={
                        data.is_internal
                            ? 'Add an internal note...'
                            : 'Add a comment...'
                    }
                    rows={3}
                    className={cn(
                        'mt-2 flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        data.is_internal &&
                            'border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/20',
                    )}
                />
                <InputError message={errors.body} />
            </div>

            {isAgent && (
                <label className="flex cursor-pointer items-center gap-2">
                    <input
                        type="checkbox"
                        checked={data.is_internal}
                        onChange={(e) =>
                            setData('is_internal', e.target.checked)
                        }
                        className="rounded border-input text-primary focus-visible:ring-ring/50"
                    />
                    <span className="text-sm text-muted-foreground">
                        Internal note (not visible to clients)
                    </span>
                </label>
            )}

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={processing || !data.body.trim()}
                >
                    {processing ? 'Posting...' : 'Post comment'}
                </Button>
            </div>
        </form>
    );
}

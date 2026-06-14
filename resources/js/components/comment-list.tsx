import { cn } from '@/lib/utils';
import type { Comment } from '@/types';

type CommentListProps = {
    comments: Comment[];
};

export function CommentList({ comments }: CommentListProps) {
    if (comments.length === 0) {
        return (
            <p className="py-4 text-center text-sm text-muted-foreground">
                No comments yet.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div
                    key={comment.id}
                    className={cn(
                        'rounded-lg border p-4',
                        comment.is_internal &&
                            'border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/30',
                        !comment.is_internal && 'bg-card',
                    )}
                >
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                                {comment.user.name}
                            </span>
                            {comment.is_internal && (
                                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                    Internal note
                                </span>
                            )}
                        </div>
                        <time className="text-xs text-muted-foreground">
                            {comment.created_at}
                        </time>
                    </div>
                    <div className="text-sm whitespace-pre-wrap text-foreground">
                        {comment.body}
                    </div>
                </div>
            ))}
        </div>
    );
}

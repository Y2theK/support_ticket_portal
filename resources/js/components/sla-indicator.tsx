import type { SlaState } from '@/types';
import { cn } from '@/lib/utils';

const slaConfig: Record<
    SlaState,
    { label: string; dotClass: string; bgClass: string }
> = {
    on_track: {
        label: 'On track',
        dotClass: 'bg-green-500',
        bgClass:
            'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-transparent',
    },
    due_soon: {
        label: 'Due soon',
        dotClass: 'bg-amber-500',
        bgClass:
            'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-transparent',
    },
    overdue: {
        label: 'Overdue',
        dotClass: 'bg-red-500',
        bgClass:
            'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-transparent',
    },
};

export function SlaIndicator({ state }: { state: SlaState }) {
    const config = slaConfig[state];

    return (
        <span
            className={cn(
                'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                config.bgClass,
            )}
        >
            <span
                className={cn(
                    'inline-block size-1.5 rounded-full',
                    config.dotClass,
                )}
            />
            {config.label}
        </span>
    );
}

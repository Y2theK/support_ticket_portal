import type { TicketPriority } from '@/types';
import { cn } from '@/lib/utils';

const priorityConfig: Record<
    TicketPriority,
    { label: string; className: string }
> = {
    low: {
        label: 'Low',
        className:
            'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300 border-transparent',
    },
    normal: {
        label: 'Normal',
        className:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-transparent',
    },
    high: {
        label: 'High',
        className:
            'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-transparent',
    },
    critical: {
        label: 'Critical',
        className:
            'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-transparent',
    },
};

export function TicketPriorityBadge({
    priority,
}: {
    priority: TicketPriority;
}) {
    const config = priorityConfig[priority];

    return (
        <span
            className={cn(
                'inline-flex w-fit shrink-0 items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                config.className,
            )}
        >
            {config.label}
        </span>
    );
}

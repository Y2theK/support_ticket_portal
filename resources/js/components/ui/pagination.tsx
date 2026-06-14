import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationLinks, PaginationMeta } from '@/types/ticket';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PaginationProps = {
    links: PaginationLinks;
    meta: PaginationMeta;
    onPageChange: (url: string) => void;
};

export function Pagination({ links, meta, onPageChange }: PaginationProps) {
    const { current_page, path } = meta;

    const lastPage = links.last ? Number(new URL(links.last, window.location.origin).searchParams.get('page')) || 1 : 1;

    const pages: number[] = [];
    for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
    }

    const visiblePages = getVisiblePages(pages, current_page);

    return (
        <div className="flex items-center justify-center gap-1 pt-4">
            <Button
                variant="outline"
                size="sm"
                disabled={!links.prev}
                onClick={() => links.prev && onPageChange(links.prev)}
            >
                <ChevronLeft className="size-4" />
                Prev
            </Button>

            {visiblePages.map((page, i) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">
                            ...
                        </span>
                    );
                }

                const url = `${path}?page=${page}`;
                return (
                    <Button
                        key={page}
                        variant={page === current_page ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                            'min-w-9',
                            page === current_page && 'pointer-events-none',
                        )}
                        onClick={() => onPageChange(url)}
                    >
                        {page}
                    </Button>
                );
            })}

            <Button
                variant="outline"
                size="sm"
                disabled={!links.next}
                onClick={() => links.next && onPageChange(links.next)}
            >
                Next
                <ChevronRight className="size-4" />
            </Button>
        </div>
    );
}

function getVisiblePages(pages: number[], current: number): (number | '...')[] {
    if (pages.length <= 7) return pages;

    const result: (number | '...')[] = [];

    if (current <= 4) {
        result.push(...pages.slice(0, 5), '...', pages[pages.length - 1]);
    } else if (current >= pages.length - 3) {
        result.push(pages[0], '...', ...pages.slice(-5));
    } else {
        result.push(pages[0], '...', current - 1, current, current + 1, '...', pages[pages.length - 1]);
    }

    return result;
}

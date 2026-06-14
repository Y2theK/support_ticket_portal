import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { TicketStatus, TicketPriority, Organization } from '@/types';

type Filters = {
    search: string;
    status: TicketStatus;
    priority: TicketPriority;
    organization_id: string;
};

type TicketFiltersProps = {
    filters: Filters;
    onFilterChange: (key: keyof Filters, value: string) => void;
    onClear?: () => void;
    organizations?: Organization[];
    showOrganization?: boolean;
};

export function TicketFilters({
    filters,
    onFilterChange,
    onClear,
    organizations,
    showOrganization,
}: TicketFiltersProps) {
    const hasActiveFilters =
        filters.search ||
        filters.status ||
        filters.priority ||
        filters.organization_id;

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search tickets..."
                    value={filters.search}
                    onChange={(e) => onFilterChange('search', e.target.value)}
                    className="pl-8"
                />
            </div>

            <Select
                value={filters.status}
                onValueChange={(v) => onFilterChange('status', v)}
            >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.priority}
                onValueChange={(v) => onFilterChange('priority', v)}
            >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
            </Select>

            {showOrganization && organizations && (
                <Select
                    value={filters.organization_id}
                    onValueChange={(v) => onFilterChange('organization_id', v)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All organizations" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All organizations</SelectItem>
                        {organizations.map((org) => (
                            <SelectItem key={org.id} value={String(org.id)}>
                                {org.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={() => onClear?.()}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <X className="size-4" />
                    Clear
                </button>
            )}
        </div>
    );
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'normal' | 'high' | 'critical';

export type SlaState = 'on_track' | 'due_soon' | 'overdue';

export type Organization = {
    id: number;
    name: string;
    slug: string;
};

export type TicketUser = {
    id: number;
    name: string;
};

export type Comment = {
    id: number;
    body: string;
    is_internal: boolean;
    user: TicketUser;
    created_at: string;
};

export type PaginationLinks = {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
};

export type PaginationMeta = {
    current_page: number;
    current_page_url: string;
    from: number;
    path: string;
    per_page: number;
    to: number;
};

export type PaginatedResponse<T> = {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
};

export type Ticket = {
    id: number;
    title: string;
    description?: string;
    status: TicketStatus;
    priority: TicketPriority;
    sla_state: SlaState;
    sla_deadline: string;
    assigned_to: number | null;
    organization?: Organization;
    user?: TicketUser;
    assignee?: TicketUser | null;
    comments?: Comment[];
    created_at: string;
};

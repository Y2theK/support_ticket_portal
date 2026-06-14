import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SlaIndicator } from '@/components/sla-indicator';
import { CommentList } from '@/components/comment-list';
import { CommentForm } from '@/components/comment-form';
import admin from '@/routes/admin';
import type { Auth, Ticket, TicketUser } from '@/types';

type PageProps = {
    ticket: Ticket;
    agents: TicketUser[];
};

export default function Show({ ticket, agents }: PageProps) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const [selectedStatus, setSelectedStatus] = useState<string>(ticket.status);
    const [selectedPriority, setSelectedPriority] = useState<string>(
        ticket.priority,
    );
    const [selectedAssignee, setSelectedAssignee] = useState<string>(
        String(ticket.assigned_to ?? ''),
    );

    const isDirty =
        selectedStatus !== ticket.status ||
        selectedPriority !== ticket.priority ||
        selectedAssignee !== String(ticket.assigned_to ?? '');

    function handleUpdate() {
        router.patch(
            admin.tickets.update(ticket.id).url,
            {
                title: ticket.title,
                description: ticket.description ?? '',
                priority: selectedPriority,
                status: selectedStatus,
                assigned_to:
                    selectedAssignee === '' ? null : Number(selectedAssignee),
            },
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    }

    return (
        <>
            <Head title={ticket.title} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={admin.tickets.index()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold tracking-tight">
                            {ticket.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {ticket.organization?.name ?? 'N/A'}
                            {' · '}
                            Created {ticket.created_at}
                            {ticket.user && <> by {ticket.user.name}</>}
                        </p>
                    </div>
                </div>
                {ticket.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm whitespace-pre-wrap text-foreground">
                                {ticket.description}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="resolved">
                                        Resolved
                                    </SelectItem>
                                    <SelectItem value="closed">
                                        Closed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Priority
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Select
                                value={selectedPriority}
                                onValueChange={setSelectedPriority}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="normal">
                                        Normal
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">
                                        Critical
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Assigned To
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Select
                                value={selectedAssignee}
                                onValueChange={setSelectedAssignee}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* <SelectItem value="">
                                        Unassigned
                                    </SelectItem> */}
                                    {agents.map((agent) => (
                                        <SelectItem
                                            key={agent.id}
                                            value={String(agent.id)}
                                        >
                                            {agent.name}
                                            {agent.id === auth.user.id
                                                ? ' (you)'
                                                : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedAssignee !== String(auth.user.id) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                        setSelectedAssignee(
                                            String(auth.user.id),
                                        )
                                    }
                                >
                                    <UserCheck className="mr-1 size-4" />
                                    Assign to me
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                SLA State
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <SlaIndicator state={ticket.sla_state} />
                            <p className="text-xs text-muted-foreground">
                                Deadline: {ticket.sla_deadline}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleUpdate} disabled={!isDirty}>
                        Update Ticket
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Conversation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CommentList comments={ticket.comments ?? []} />
                        <Separator className="my-6" />
                        <CommentForm
                            isAgent
                            postUrl={
                                admin.tickets.comments.store(ticket.id).url
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: admin.dashboard(),
        },
        {
            title: 'All Tickets',
            href: admin.tickets.index(),
        },
        {
            title: 'Ticket',
            href: admin.tickets.show({ ticket: 0 }),
        },
    ],
};

<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Tickets\UpdateTicket;
use App\Http\Controllers\Controller;
use App\Http\Requests\TicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(TicketRequest $request): Response
    {

        $organizations = Organization::orderBy('name', 'asc')->get(['id', 'name']);

        $tickets = Ticket::with(['organization:id,name', 'user:id,name', 'assignee:id,name'])
            ->filter($request->only(['search', 'status', 'priority', 'organization_id']))
            ->latest()
            ->paginate();

        return Inertia::render('admin/tickets/index', [
            'tickets' => TicketResource::collection($tickets)->response()->getData(true),
            'filters' => $request->only(['search', 'status', 'priority', 'organization_id']),
            'organizations' => $organizations,
        ]);
    }

    public function show(Ticket $ticket): Response
    {
        $this->authorize('view', $ticket);

        $ticket->load(['organization:id,name', 'user:id,name', 'assignee:id,name', 'comments.user:id,name']);

        $agents = User::agent()->get(['id', 'name']);

        return Inertia::render('admin/tickets/[id]', [
            'ticket' => TicketResource::make($ticket),
            'agents' => $agents,
        ]);
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket, UpdateTicket $action): RedirectResponse
    {
        $this->authorize('update', $ticket);

        $action->handle($ticket, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ticket updated.')]);

        return back();
    }
}

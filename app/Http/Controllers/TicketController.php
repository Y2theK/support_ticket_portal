<?php

namespace App\Http\Controllers;

use App\Actions\Tickets\CreateTicket;
use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Organization;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(Request $request): Response
    {
        $request->validate([
            'status' => ['sometimes', new Enum(TicketStatus::class)],
            'priority' => ['sometimes', new Enum(TicketPriority::class)],
        ]);

        /** @var Organization $organization */
        $organization = $request->user()->organization ?? abort(403);
        $tickets = Ticket::forOrganization($organization)
            ->filter($request->only(['search', 'status', 'priority']))
            ->latest()
            ->paginate();

        return Inertia::render('tickets/index', [
            'tickets' => TicketResource::collection($tickets)->response()->getData(true),
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function show(Request $request, Ticket $ticket): Response
    {
        $this->authorize('view', $ticket);

        return Inertia::render('tickets/[id]', [
            'ticket' => TicketResource::make($ticket->load([
                'user',
                'comments' => fn ($query) => $query->public()->with('user'),
            ])),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tickets/create');
    }

    public function store(StoreTicketRequest $request, CreateTicket $action): RedirectResponse
    {
        $ticket = $action->handle($request->user(), $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ticket created.')]);

        return to_route('tickets.show', $ticket);
    }
}

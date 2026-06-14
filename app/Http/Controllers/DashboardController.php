<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Http\Resources\TicketResource;
use App\Models\Organization;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var Organization $organization */
        $organization = $request->user()->organization ?? abort(403);
        $tickets = Ticket::forOrganization($organization);

        return Inertia::render('dashboard', [
            'ticketCount' => (clone $tickets)->count('id'),
            'openTickets' => (clone $tickets)->where('status', TicketStatus::Open)->count('id'),
            'inProgressTickets' => (clone $tickets)->where('status', TicketStatus::InProgress)->count('id'),
            'resolvedOrClosedTickets' => (clone $tickets)->where('status', TicketStatus::InProgress)->count('id'),
            'overdueTickets' => (clone $tickets)->where('sla_deadline', '<=', Carbon::now())->count('id'),
            'recentTickets' => TicketResource::collection(
                (clone $tickets)->latest()->limit(5)->get()
            ),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TicketStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $base = Ticket::with('organization:id,name');

        return Inertia::render('admin/dashboard', [
            'totalTickets' => (clone $base)->count(),
            'openTickets' => (clone $base)->where('status', TicketStatus::Open)->count(),
            'inProgressTickets' => (clone $base)->where('status', TicketStatus::InProgress)->count(),
            'resolvedTickets' => (clone $base)->where('status', TicketStatus::Resolved)->count(),
            'closedTickets' => (clone $base)->where('status', TicketStatus::Closed)->count(),
            'overdueCount' => (clone $base)->where('sla_deadline', '<=', Carbon::now())->count(),
            'unassignedCount' => (clone $base)->whereNull('assigned_to')->count(),
            'recentTickets' => TicketResource::collection(
                (clone $base)->latest()->limit(5)->get()
            ),
        ]);
    }
}

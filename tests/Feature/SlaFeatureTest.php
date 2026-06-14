<?php

use App\Enums\SlaState;
use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;

describe('SLA deadline on ticket creation', function () {

    it('sets sla_deadline for low priority tickets', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);

        $this->actingAs($client)->post(route('tickets.store'), [
            'title' => 'Low priority',
            'description' => 'Test',
            'priority' => TicketPriority::Low->value,
        ]);

        $ticket = Ticket::where('title', 'Low priority')->first();
        expect($ticket->sla_deadline)->not->toBeNull();
        expect($ticket->sla_deadline->isFuture())->toBeTrue();
        expect(now()->diffInHours($ticket->sla_deadline))->toBeGreaterThanOrEqual(71);
    });

    it('sets sla_deadline for normal priority tickets', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);

        $this->actingAs($client)->post(route('tickets.store'), [
            'title' => 'Normal priority',
            'description' => 'Test',
            'priority' => TicketPriority::Normal->value,
        ]);

        $ticket = Ticket::where('title', 'Normal priority')->first();
        expect(now()->diffInHours($ticket->sla_deadline))->toBeGreaterThanOrEqual(23);
    });

    it('sets sla_deadline for high priority tickets', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);

        $this->actingAs($client)->post(route('tickets.store'), [
            'title' => 'High priority',
            'description' => 'Test',
            'priority' => TicketPriority::High->value,
        ]);

        $ticket = Ticket::where('title', 'High priority')->first();
        expect(now()->diffInHours($ticket->sla_deadline))->toBeGreaterThanOrEqual(7);
    });

    it('sets sla_deadline for critical priority tickets', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);

        $this->actingAs($client)->post(route('tickets.store'), [
            'title' => 'Critical priority',
            'description' => 'Test',
            'priority' => TicketPriority::Critical->value,
        ]);

        $ticket = Ticket::where('title', 'Critical priority')->first();
        expect(now()->diffInHours($ticket->sla_deadline))->toBeGreaterThanOrEqual(1);
    });

});

describe('SLA deadline recalculation on priority change', function () {

    it('recalculates sla_deadline when priority is downgraded', function () {
        $org = Organization::factory()->create();
        $agent = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->for($org)->create([
            'user_id' => $client->id,
            'priority' => TicketPriority::Critical,
            'sla_deadline' => now()->addHours(2),
        ]);

        $originalDeadline = $ticket->sla_deadline;

        $this->actingAs($agent)
            ->patch(route('admin.tickets.update', $ticket), [
                'priority' => TicketPriority::Low->value,
            ]);

        $fresh = $ticket->fresh();
        expect($fresh->sla_deadline->greaterThan($originalDeadline))->toBeTrue();
    });

    it('recalculates sla_deadline when priority is upgraded', function () {
        $org = Organization::factory()->create();
        $agent = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->for($org)->create([
            'user_id' => $client->id,
            'priority' => TicketPriority::Low,
            'sla_deadline' => now()->addHours(72),
        ]);

        $originalDeadline = $ticket->sla_deadline;

        $this->actingAs($agent)
            ->patch(route('admin.tickets.update', $ticket), [
                'priority' => TicketPriority::Critical->value,
            ]);

        $fresh = $ticket->fresh();
        expect($fresh->sla_deadline->lessThan($originalDeadline))->toBeTrue();
    });

    it('does not change sla_deadline when priority value is the same', function () {
        $org = Organization::factory()->create();
        $agent = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->for($org)->create([
            'user_id' => $client->id,
            'priority' => TicketPriority::Normal,
            'sla_deadline' => now()->addHours(24),
        ]);

        $originalDeadline = $ticket->sla_deadline;

        $this->actingAs($agent)
            ->patch(route('admin.tickets.update', $ticket), [
                'priority' => TicketPriority::Normal->value,
                'status' => TicketStatus::InProgress->value,
            ]);

        $fresh = $ticket->fresh();
        expect($fresh->sla_deadline->toDateTimeString())->toBe($originalDeadline->toDateTimeString());
    });

    it('does not change sla_deadline when priority is absent', function () {
        $org = Organization::factory()->create();
        $agent = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->for($org)->create([
            'user_id' => $client->id,
            'priority' => TicketPriority::Normal,
            'sla_deadline' => now()->addHours(24),
        ]);

        $originalDeadline = $ticket->sla_deadline;

        $this->actingAs($agent)
            ->patch(route('admin.tickets.update', $ticket), [
                'status' => TicketStatus::InProgress->value,
            ]);

        $fresh = $ticket->fresh();
        expect($fresh->sla_deadline->toDateTimeString())->toBe($originalDeadline->toDateTimeString());
    });

});

describe('SLA state in admin ticket show', function () {

    it('shows sla_state in the admin response', function () {
        $org = Organization::factory()->create();
        $agent = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->for($org)->create([
            'user_id' => $client->id,
            'sla_deadline' => now()->addDay(),
        ]);

        $response = $this->actingAs($agent)
            ->get(route('admin.tickets.show', $ticket));

        $response->assertInertia(fn ($page) => $page
            ->component('admin/tickets/[id]')
            ->has('ticket.sla_state')
        );
    });

    it('reports overdue sla_state for past deadline tickets', function () {
        $org = Organization::factory()->create();
        $agent = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->for($org)->create([
            'user_id' => $client->id,
            'sla_deadline' => now()->subHour(),
            'created_at' => now()->subHours(2),
        ]);

        $response = $this->actingAs($agent)
            ->get(route('admin.tickets.show', $ticket));

        $response->assertInertia(fn ($page) => $page
            ->component('admin/tickets/[id]')
            ->where('ticket.sla_state', SlaState::Overdue->value)
        );
    });

    it('reports due_soon sla_state when approaching deadline', function () {
        $org = Organization::factory()->create();
        $agent = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->for($org)->create([
            'user_id' => $client->id,
            'priority' => TicketPriority::Critical,
            'sla_deadline' => now()->addMinutes(30),
            'created_at' => now()->subMinutes(90),
        ]);

        $response = $this->actingAs($agent)
            ->get(route('admin.tickets.show', $ticket));

        $response->assertInertia(fn ($page) => $page
            ->component('admin/tickets/[id]')
            ->where('ticket.sla_state', SlaState::DueSoon->value)
        );
    });

    it('reports on_track sla_state when far from deadline', function () {
        $org = Organization::factory()->create();
        $agent = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->for($org)->create([
            'user_id' => $client->id,
            'priority' => TicketPriority::Low,
            'sla_deadline' => now()->addDays(2),
        ]);

        $response = $this->actingAs($agent)
            ->get(route('admin.tickets.show', $ticket));

        $response->assertInertia(fn ($page) => $page
            ->component('admin/tickets/[id]')
            ->where('ticket.sla_state', SlaState::OnTrack->value)
        );
    });

});

describe('SLA state calculation', function () {

    it('returns on_track when far from deadline', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->create([
            'organization_id' => $org->id,
            'user_id' => $client->id,
            'priority' => TicketPriority::Normal,
            'sla_deadline' => now()->addHours(20),
            'created_at' => now()->subMinute(),
        ]);

        expect($ticket->slaState())->toBe(SlaState::OnTrack);
    });

    it('returns due_soon when within 25 percent of deadline', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->create([
            'organization_id' => $org->id,
            'user_id' => $client->id,
            'priority' => TicketPriority::Normal,
            'created_at' => now()->subHours(18),
            'sla_deadline' => now()->addHours(6),
        ]);

        expect($ticket->slaState())->toBe(SlaState::DueSoon);
    });

    it('returns overdue when past deadline', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->create([
            'organization_id' => $org->id,
            'user_id' => $client->id,
            'priority' => TicketPriority::Normal,
            'sla_deadline' => now()->subHour(),
            'created_at' => now()->subHours(25),
        ]);

        expect($ticket->slaState())->toBe(SlaState::Overdue);
    });

    it('returns overdue at exact deadline', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->create([
            'organization_id' => $org->id,
            'user_id' => $client->id,
            'priority' => TicketPriority::Normal,
            'sla_deadline' => now(),
            'created_at' => now()->subHours(24),
        ]);

        expect($ticket->slaState())->toBe(SlaState::Overdue);
    });

    it('returns due_soon at exactly 25 percent remaining', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->create([
            'organization_id' => $org->id,
            'user_id' => $client->id,
            'priority' => TicketPriority::Normal,
            'created_at' => now()->subHours(18),
            'sla_deadline' => now()->addHours(6),
        ]);

        expect($ticket->slaState())->toBe(SlaState::DueSoon);
    });

    it('returns on_track just above 25 percent', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->create([
            'organization_id' => $org->id,
            'user_id' => $client->id,
            'priority' => TicketPriority::Normal,
            'created_at' => now()->subHours(17),
            'sla_deadline' => now()->addHours(7),
        ]);

        expect($ticket->slaState())->toBe(SlaState::OnTrack);
    });

});

describe('SLA helper methods', function () {

    it('isOverdue returns true for overdue tickets', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->create([
            'organization_id' => $org->id,
            'user_id' => $client->id,
            'sla_deadline' => now()->subHour(),
            'created_at' => now()->subHours(2),
        ]);

        expect($ticket->isOverdue())->toBeTrue();
        expect($ticket->isOnTrack())->toBeFalse();
        expect($ticket->isDueSoon())->toBeFalse();
    });

    it('isDueSoon returns true for tickets approaching deadline', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->create([
            'organization_id' => $org->id,
            'user_id' => $client->id,
            'priority' => TicketPriority::Critical,
            'created_at' => now()->subHours(1)->subMinutes(30),
            'sla_deadline' => now()->addMinutes(30),
        ]);

        expect($ticket->isDueSoon())->toBeTrue();
        expect($ticket->isOverdue())->toBeFalse();
        expect($ticket->isOnTrack())->toBeFalse();
    });

    it('isOnTrack returns true for tickets far from deadline', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);
        $ticket = Ticket::factory()->create([
            'organization_id' => $org->id,
            'user_id' => $client->id,
            'priority' => TicketPriority::Low,
            'sla_deadline' => now()->addHours(48),
            'created_at' => now()->subHour(),
        ]);

        expect($ticket->isOnTrack())->toBeTrue();
        expect($ticket->isDueSoon())->toBeFalse();
        expect($ticket->isOverdue())->toBeFalse();
    });

    it('slaState works with all priorities', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);

        foreach (TicketPriority::cases() as $priority) {
            $ticket = Ticket::factory()->create([
                'organization_id' => $org->id,
                'user_id' => $client->id,
                'priority' => $priority,
            ]);

            expect($ticket->slaState())->not->toBeNull();
            expect($ticket->slaState())->toBeInstanceOf(SlaState::class);
        }
    });

});

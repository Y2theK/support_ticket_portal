<?php

use App\Enums\TicketPriority;
use App\Models\Ticket;

describe('SLA deadline calculation', function () {

    it('returns 72 hours for low priority', function () {
        $before = now();
        $deadline = Ticket::calculateSLADeadline(TicketPriority::Low);

        $this->assertEqualsWithDelta(72, $before->diffInHours($deadline), 0.1);
    });

    it('returns 24 hours for normal priority', function () {
        $before = now();
        $deadline = Ticket::calculateSLADeadline(TicketPriority::Normal);

        $this->assertEqualsWithDelta(24, $before->diffInHours($deadline), 0.1);
    });

    it('returns 8 hours for high priority', function () {
        $before = now();
        $deadline = Ticket::calculateSLADeadline(TicketPriority::High);

        $this->assertEqualsWithDelta(8, $before->diffInHours($deadline), 0.1);
    });

    it('returns 2 hours for critical priority', function () {
        $before = now();
        $deadline = Ticket::calculateSLADeadline(TicketPriority::Critical);

        $this->assertEqualsWithDelta(2, $before->diffInHours($deadline), 0.1);
    });

    it('accepts string for priority', function () {
        $before = now();
        $deadline = Ticket::calculateSLADeadline('critical');

        $this->assertEqualsWithDelta(2, $before->diffInHours($deadline), 0.1);
    });

});

<?php

namespace Database\Factories;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        $priority = fake()->randomElement(TicketPriority::cases());

        return [
            'organization_id' => Organization::factory(),
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraphs(3, true),
            'status' => fake()->randomElement(TicketStatus::cases()),
            'priority' => $priority,
            'sla_deadline' => fake()->boolean(20)
                ? now()->subHours(rand(1, 6))
                : match ($priority) {
                    TicketPriority::Low => now()->addHours(rand(48, 96)),
                    TicketPriority::Normal => now()->addHours(rand(12, 36)),
                    TicketPriority::High => now()->addHours(rand(4, 12)),
                    TicketPriority::Critical => now()->addHours(rand(1, 4)),
                    default => now()->addHours(24),
                },
        ];
    }
}

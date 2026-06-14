<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', UserRole::Client)->select(['id', 'organization_id'])->get();
        $agentIds = User::where('role', UserRole::Agent)->pluck('id');

        for ($i = 0; $i < 16; $i++) {
            $user = $users->random();

            Ticket::factory()->create([
                'user_id' => $user->id,
                'organization_id' => $user->organization_id,
                'assigned_to' => fake()->optional(0.7)->randomElement($agentIds),
            ]);
        }
    }
}

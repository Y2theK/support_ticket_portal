<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $ticketIds = Ticket::pluck('id');
        $userIds = User::pluck('id');

        for ($i = 0; $i < 20; $i++) {
            Comment::factory()->create([
                'ticket_id' => $ticketIds->random(),
                'user_id' => $userIds->random(),
                'is_internal' => fake()->boolean(30),
            ]);
        }
    }
}

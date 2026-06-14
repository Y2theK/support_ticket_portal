<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $orgIds = Organization::pluck('id');

        User::factory(3)->create([
            'role' => UserRole::Agent,
            'organization_id' => null,
        ]);

        foreach (range(1, 5) as $i) {
            User::factory()->create([
                'role' => UserRole::Client,
                'organization_id' => $orgIds->random(),
            ]);
        }

        User::factory()->create([
            'name' => 'Client User',
            'email' => 'client@example.com',
            'role' => UserRole::Client,
            'organization_id' => $orgIds->random(),
        ]);

        User::factory()->create([
            'name' => 'Agent User',
            'email' => 'agent@example.com',
            'role' => UserRole::Agent,
            'organization_id' => null,
        ]);
    }
}

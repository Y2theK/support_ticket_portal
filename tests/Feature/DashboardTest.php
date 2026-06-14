<?php

use App\Enums\UserRole;
use App\Models\Organization;
use App\Models\User;

describe('Client dashboard access', function () {

    it('redirects guest to login', function () {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    });

    it('allows authenticated client access', function () {
        $org = Organization::factory()->create();
        $user = User::factory()->create([
            'role' => UserRole::Client->value,
            'organization_id' => $org->id,
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk();
    });

    it('forbids agent access', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);

        $this->actingAs($client)
            ->get(route('dashboard'))
            ->assertForbidden();
    });

});

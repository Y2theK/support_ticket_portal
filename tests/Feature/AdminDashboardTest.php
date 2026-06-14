<?php

use App\Enums\UserRole;
use App\Models\Organization;
use App\Models\User;

describe('Admin dashboard access', function () {

    it('redirects guest to login', function () {
        $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
    });

    it('forbids client access', function () {
        $org = Organization::factory()->create();
        $client = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);

        $this->actingAs($client)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    });

    it('allows agent access', function () {
        $agent = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);

        $this->actingAs($agent)
            ->get(route('admin.dashboard'))
            ->assertOk();
    });

});

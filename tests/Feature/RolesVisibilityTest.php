<?php

use App\Enums\UserRole;
use App\Models\Organization;
use App\Models\User;

describe('User role helpers', function () {

    it('returns true for isAgent when role is agent', function () {
        $user = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);

        expect($user->isAgent())->toBeTrue();
    });

    it('returns false for isAgent when role is client', function () {
        $org = Organization::factory()->create();
        $user = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);

        expect($user->isAgent())->toBeFalse();
    });

    it('returns true for isClient when role is client', function () {
        $org = Organization::factory()->create();
        $user = User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);

        expect($user->isClient())->toBeTrue();
    });

    it('returns false for isClient when role is agent', function () {
        $user = User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);

        expect($user->isClient())->toBeFalse();
    });

    it('scopeAgent returns only agent users', function () {
        $org = Organization::factory()->create();
        User::factory()->create(['role' => UserRole::Agent->value, 'organization_id' => null]);
        User::factory()->create(['role' => UserRole::Client->value, 'organization_id' => $org->id]);

        $agents = User::agent()->get();

        expect($agents)->toHaveCount(1);
        expect($agents->first()->role)->toBe(UserRole::Agent);
    });

});

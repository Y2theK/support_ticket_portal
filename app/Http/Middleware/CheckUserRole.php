<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        if ($role === UserRole::Agent->value && ! $user->isAgent()) {
            abort(403);
        }

        if ($role === UserRole::Client->value && ! $user->isClient()) {
            abort(403);
        }

        return $next($request);
    }
}

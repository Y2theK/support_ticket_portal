<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        $redirect = $user && $user->isAgent()
            ? '/admin/dashboard'
            : '/dashboard';

        return $request->wantsJson()
            ? new JsonResponse('', 204)
            : redirect()->intended($redirect);
    }
}

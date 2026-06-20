<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EagerLoadUserRole
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            $request->user()->loadMissing('role');
        }

        return $next($request);
    }
}
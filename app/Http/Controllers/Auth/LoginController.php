<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class LoginController extends Controller
{
    public function showLogin(): View|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        $demoUsers = User::with('role')
            ->whereIn('email', ['admin@library.dev', 'member@library.dev', 'premium@library.dev'])
            ->get()
            ->keyBy('role.slug');

        return view('auth.login', compact('demoUsers'));
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            Auth::user()->load('role');
            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function demoLogin(Request $request, string $role): RedirectResponse
    {
        $allowed = ['admin', 'member', 'premium'];
        if (! in_array($role, $allowed, true)) {
            abort(404);
        }

        $user = User::with('role')
            ->whereHas('role', fn($q) => $q->where('slug', $role))
            ->firstOrFail();

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->route('dashboard')
            ->with('success', "Logged in as {$user->name} ({$user->role->name})");
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }
}
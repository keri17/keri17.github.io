<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Borrowing;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [];

    public function boot(): void
    {
        Gate::define('admin-only',           fn(User $u) => $u->isAdmin());
        Gate::define('premium-or-admin',     fn(User $u) => $u->isPremium() || $u->isAdmin());
        Gate::define('manage-users',         fn(User $u) => $u->isAdmin());
        Gate::define('manage-books',         fn(User $u) => $u->isAdmin());
        Gate::define('delete-user',          fn(User $u) => $u->isAdmin());
        Gate::define('view-all-borrowings',  fn(User $u) => $u->isAdmin());
        Gate::define('borrow-premium-books', fn(User $u) => $u->isPremium() || $u->isAdmin());
        Gate::define('view-premium-catalog', fn(User $u) => $u->isPremium() || $u->isAdmin());
        Gate::define('extended-loan-period', fn(User $u) => $u->isPremium() || $u->isAdmin());

Gate::define('view-all-borrowings', fn($user) =>
    $user->role->name === 'Admin'
);

Gate::define('manage-books', fn($user) =>
    $user->role->name === 'Admin'
);

Gate::define('borrow-premium-books', fn($user) =>
    in_array($user->role->name, ['Admin', 'Premium'])
);

Gate::define('return-borrowing', fn($user, Borrowing $borrowing) =>
    $user->id === $borrowing->user_id || $user->role->name === 'Admin'
);
        }
}
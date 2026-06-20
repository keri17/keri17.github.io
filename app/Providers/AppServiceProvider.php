<?php

namespace App\Providers;

use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::define('view-all-borrowings', fn(User $user) =>
            $user->isAdmin()
        );

        Gate::define('manage-books', fn(User $user) =>
            $user->isAdmin()
        );

        Gate::define('manage-users', fn(User $user) =>
            $user->isAdmin()
        );

        Gate::define('borrow-premium-books', fn(User $user) =>
            $user->isAdmin() || $user->isPremium()
        );

        Gate::define('borrow-books', fn(User $user) =>
            ! $user->isAdmin()
        );

        Gate::define('return-borrowing', fn(User $user, Borrowing $borrowing) =>
            $user->isAdmin() || $user->id === $borrowing->user_id
        );
    }
}
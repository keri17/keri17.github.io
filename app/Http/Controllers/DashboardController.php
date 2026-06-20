<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $data = [];
        $role = $user->role->slug; // 'admin' | 'premium' | 'member'

        if ($user->isAdmin()) {
            $data = [
                'total_books'        => Book::count(),
                'total_users'        => User::count(),
                'active_borrowings'  => Borrowing::whereNull('returned_at')->count(),
                'overdue_count'      => Borrowing::whereNull('returned_at')
                                            ->where('due_at', '<', now())
                                            ->count(),
            ];
        } elseif ($user->isPremium()) {
            $data = [
                'active_borrowings'  => $user->activeBorrowings()->with('book')->get(),
                'premium_book_count' => Book::where('is_premium', true)
                                            ->where('available_copies', '>', 0)
                                            ->count(),
            ];
        } else {
            // Member
            $data = [
                'active_borrowings'        => $user->activeBorrowings()->with('book')->get(),
                'available_standard_books' => Book::where('is_premium', false)
                                                ->where('available_copies', '>', 0)
                                                ->count(),
            ];
        }

        return view('dashboard', array_merge(['role' => $role], $data));
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class BorrowingController extends Controller
{
   public function borrowBook(Request $request, Book $book)
{
    Gate::authorize('borrow-books');

    $user = Auth::user();

    if (!$book->isAvailable()) {
        return back()->with('error', "'{$book->title}' has no available copies.");
    }

    $alreadyHasThisBook = $user->borrowings()
        ->where('book_id', $book->id)
        ->whereNull('returned_at')
        ->exists();

    if ($alreadyHasThisBook) {
        return back()->with('error', "You already have a copy of '{$book->title}' checked out. Return it before borrowing another copy.");
    }

    if (!$user->canBorrowMore()) {
        return back()->with('error',
            "Borrow limit reached ({$user->getBorrowLimit()} books). Return a book first."
        );
    }

    DB::transaction(function () use ($user, $book) {
        Borrowing::create([
            'user_id'     => $user->id,
            'book_id'     => $book->id,
            'borrowed_at' => now(),
            'due_at'      => now()->addDays($user->getLoanPeriodDays()),
            'status'      => 'active',
        ]);

        $book->decrement('available_copies');
    });

    return back()->with('success',
        "'{$book->title}' borrowed. Due in {$user->getLoanPeriodDays()} days."
    );
}
    public function myBorrowings(Request $request)
    {
        $borrowings = Auth::user()
            ->borrowings()
            ->with(['book.authors', 'book.publisher'])
            ->latest('borrowed_at')
            ->paginate(10);

        return view('borrowings.my', compact('borrowings'));
    }

    public function allBorrowings(Request $request)
    {
        Gate::authorize('view-all-borrowings');

        $borrowings = Borrowing::with(['user', 'book.authors'])
            ->latest('borrowed_at')
            ->paginate(20);

        return view('borrowings.all', compact('borrowings'));
    }
}
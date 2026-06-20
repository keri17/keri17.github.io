<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Book;
use App\Models\Publisher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class BookController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $roleName = $user->role->name;

        $query = Book::with(['authors', 'publisher']);

        if ($roleName === 'Member') {
            $query->where('is_premium', false);
        }

        $books = $query->paginate(15);

        return view('books.index', compact('books'));
    }

    public function show(Book $book)
    {
        $book->load(['authors', 'publisher']);

        return view('books.show', compact('book'));
    }

    public function premiumCatalog()
    {
        Gate::authorize('borrow-premium-books');

        $books = Book::with(['authors', 'publisher'])
            ->where('is_premium', true)
            ->paginate(15);

        return view('books.premium', compact('books'));
    }

    public function create()
    {
        Gate::authorize('manage-books');

        $authors    = Author::orderBy('name')->get();
        $publishers = Publisher::orderBy('name')->get();

        return view('books.create', compact('authors', 'publishers'));
    }

    public function store(Request $request)
    {
        Gate::authorize('manage-books');

        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'publisher_id'     => 'required|exists:publishers,id',
            'isbn'             => 'required|string|unique:books,isbn',
            'published_year'   => 'nullable|integer|min:1000|max:' . date('Y'),
            'total_copies'     => 'required|integer|min:1',
            'available_copies' => 'required|integer|min:0',
            'is_premium'       => 'boolean',
            'authors'          => 'required|array|min:1',
            'authors.*'        => 'exists:authors,id',
        ]);

        $book = Book::create($data);
        $book->authors()->sync($request->input('authors', []));

        return redirect()->route('books.show', $book)
            ->with('success', "Book '{$book->title}' created successfully.");
    }

    public function edit(Book $book)
    {
        Gate::authorize('manage-books');

        $authors    = Author::orderBy('name')->get();
        $publishers = Publisher::orderBy('name')->get();
        $book->load('authors');

        return view('books.edit', compact('book', 'authors', 'publishers'));
    }

    public function update(Request $request, Book $book)
    {
        Gate::authorize('manage-books');

        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'publisher_id'     => 'required|exists:publishers,id',
            'isbn'             => 'required|string|unique:books,isbn,' . $book->id,
            'published_year'   => 'nullable|integer|min:1000|max:' . date('Y'),
            'total_copies'     => 'required|integer|min:1',
            'available_copies' => 'required|integer|min:0',
            'is_premium'       => 'boolean',
            'authors'          => 'required|array|min:1',
            'authors.*'        => 'exists:authors,id',
        ]);

        $book->update($data);
        $book->authors()->sync($request->input('authors', []));

        return redirect()->route('books.show', $book)
            ->with('success', "Book '{$book->title}' updated.");
    }

    public function destroy(Book $book)
    {
        Gate::authorize('manage-books');

        $book->delete();

        return redirect()->route('books.index')
            ->with('success', "Book deleted successfully.");
    }
}
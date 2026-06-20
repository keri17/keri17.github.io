@extends('layouts.app')
@section('title', 'Books — BiblioVerse')

@section('content')

<div class="flex items-center justify-between mb-8">
    <div>
        <h1 class="text-2xl font-bold mb-1">Book Catalog</h1>
        <p class="text-slate-400">
            @if(auth()->user()->isMember())
                Standard catalog — upgrade to Premium for exclusive titles.
            @else
                Full catalog including premium titles.
            @endif
        </p>
    </div>

    @if(auth()->user()->isAdmin())
    <a href="{{ route('admin.books.create') }}"
       class="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition">
        + Add Book
    </a>
    @endif
</div>

@if($books->isEmpty())
<div class="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
    No books found.
</div>
@else
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
    @foreach($books as $book)
        @include('partials.book-card', ['book' => $book])
    @endforeach
</div>

{{ $books->links() }}
@endif

@endsection
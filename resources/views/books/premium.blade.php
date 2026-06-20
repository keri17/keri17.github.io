@extends('layouts.app')
@section('title', 'Premium Catalog — BiblioVerse')

@section('content')

<div class="mb-8">
    <span class="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-400/30 text-orange-300 mb-3 inline-block">
        Premium Access
    </span>
    <h1 class="text-2xl font-bold mb-1">Premium Catalog</h1>
    <p class="text-slate-400">Exclusive titles available to Premium and Admin members.</p>
</div>

@if($books->isEmpty())
<div class="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
    No premium books available right now.
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
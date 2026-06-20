@extends('layouts.app')
@section('title', $book->title . ' — BiblioVerse')

@section('content')

<a href="{{ route('books.index') }}" class="text-sm text-slate-400 hover:text-white transition mb-6 inline-block">
    ← Back to catalog
</a>

<div class="grid grid-cols-1 md:grid-cols-3 gap-8">

    <div class="md:col-span-2">
        <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <div class="flex items-start justify-between gap-4 mb-4">
                <h1 class="text-2xl font-bold">{{ $book->title }}</h1>
                @if($book->is_premium)
                <span class="shrink-0 text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-400/30 text-orange-300">
                    Premium
                </span>
                @endif
            </div>

            <p class="text-slate-300 mb-1">
                <span class="text-slate-500">By</span>
                {{ $book->authors->pluck('name')->join(', ') ?: 'Unknown author' }}
            </p>
            <p class="text-slate-500 text-sm mb-6">
                {{ $book->publisher->name ?? 'Unknown publisher' }} · {{ $book->published_year }}
                @if($book->genre) · {{ $book->genre }} @endif
            </p>

            @if($book->description)
            <p class="text-slate-300 leading-relaxed mb-6">{{ $book->description }}</p>
            @endif

            @if($book->isbn)
            <p class="text-xs text-slate-500">ISBN: {{ $book->isbn }}</p>
            @endif
        </div>
    </div>

    <div class="space-y-4">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p class="text-sm text-slate-400 mb-1">Availability</p>
            <p class="text-3xl font-bold {{ $book->isAvailable() ? 'text-emerald-400' : 'text-rose-400' }}">
                {{ $book->available_copies }} / {{ $book->total_copies }}
            </p>
            <p class="text-xs text-slate-500 mt-1">copies available</p>

            @if($book->isAvailable())
            <form action="{{ route('books.borrow', $book) }}" method="POST" class="mt-5">
                @csrf
                <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium hover:opacity-90 transition">
                    Borrow this book
                </button>
            </form>
            @else
            <button disabled class="w-full mt-5 py-2.5 rounded-xl bg-slate-700/50 text-slate-500 font-medium cursor-not-allowed">
                Currently unavailable
            </button>
            @endif
        </div>

       @if(auth()->user()->isAdmin())
<button disabled class="w-full mt-5 py-2.5 rounded-xl bg-slate-700/50 text-slate-500 font-medium cursor-not-allowed">
    Admins do not borrow books
</button>
@elseif($book->isAvailable())
<form action="{{ route('books.borrow', $book) }}" method="POST" class="mt-5">
    @csrf
    <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium hover:opacity-90 transition">
        Borrow this book
    </button>
</form>
@else
<button disabled class="w-full mt-5 py-2.5 rounded-xl bg-slate-700/50 text-slate-500 font-medium cursor-not-allowed">
    Currently unavailable
</button>
@endif
    </div>
</div>

@endsection
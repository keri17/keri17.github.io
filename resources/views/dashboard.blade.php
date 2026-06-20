@extends('layouts.app')
@section('title', 'Dashboard — BiblioVerse')

@section('content')

<h1 class="text-2xl font-bold mb-1">Welcome back, {{ auth()->user()->name }}</h1>
<p class="text-slate-400 mb-8">Here's what's happening with your library.</p>

@if($role === 'admin')
{{-- ADMIN DASHBOARD --}}
<div class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p class="text-sm text-slate-400 mb-1">Total Books</p>
        <p class="text-3xl font-bold text-violet-300">{{ $total_books }}</p>
    </div>
    <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p class="text-sm text-slate-400 mb-1">Total Users</p>
        <p class="text-3xl font-bold text-pink-300">{{ $total_users }}</p>
    </div>
    <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p class="text-sm text-slate-400 mb-1">Active Borrowings</p>
        <p class="text-3xl font-bold text-orange-300">{{ $active_borrowings }}</p>
    </div>
    <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p class="text-sm text-slate-400 mb-1">Overdue</p>
        <p class="text-3xl font-bold text-rose-400">{{ $overdue_count }}</p>
    </div>
</div>

<div class="flex gap-4">
    <a href="{{ route('admin.borrowings.index') }}" class="px-5 py-2.5 rounded-xl bg-violet-500/20 border border-violet-400/30 text-violet-300 hover:bg-violet-500/30 transition text-sm">
        View All Borrowings
    </a>
    <a href="{{ route('admin.books.create') }}" class="px-5 py-2.5 rounded-xl bg-pink-500/20 border border-pink-400/30 text-pink-300 hover:bg-pink-500/30 transition text-sm">
        + Add New Book
    </a>
</div>

@elseif($role === 'premium')
{{-- PREMIUM DASHBOARD --}}
<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p class="text-sm text-slate-400 mb-1">Your Active Borrows</p>
        <p class="text-3xl font-bold text-violet-300">{{ $active_borrowings->count() }}</p>
        <p class="text-xs text-slate-500 mt-1">of {{ auth()->user()->getBorrowLimit() }} limit</p>
    </div>
    <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p class="text-sm text-slate-400 mb-1">Premium Books Available</p>
        <p class="text-3xl font-bold text-orange-300">{{ $premium_book_count }}</p>
    </div>
</div>

<h2 class="text-lg font-semibold mb-4">Your Active Borrows</h2>
@include('partials.borrowing-list', ['borrowings' => $active_borrowings])

@else
{{-- MEMBER DASHBOARD --}}
<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p class="text-sm text-slate-400 mb-1">Your Active Borrows</p>
        <p class="text-3xl font-bold text-violet-300">{{ $active_borrowings->count() }}</p>
        <p class="text-xs text-slate-500 mt-1">of {{ auth()->user()->getBorrowLimit() }} limit</p>
    </div>
    <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p class="text-sm text-slate-400 mb-1">Standard Books Available</p>
        <p class="text-3xl font-bold text-emerald-300">{{ $available_standard_books }}</p>
    </div>
</div>

<h2 class="text-lg font-semibold mb-4">Your Active Borrows</h2>
@include('partials.borrowing-list', ['borrowings' => $active_borrowings])
@endif

@endsection
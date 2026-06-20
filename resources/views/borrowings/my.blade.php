@extends('layouts.app')
@section('title', 'My Borrowings — BiblioVerse')

@section('content')

<h1 class="text-2xl font-bold mb-1">My Borrowings</h1>
<p class="text-slate-400 mb-8">Your full borrowing history.</p>

@include('partials.borrowing-list', ['borrowings' => $borrowings])

@endsection
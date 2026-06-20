@extends('layouts.app')
@section('title', 'All Borrowings — BiblioVerse')

@section('content')

<h1 class="text-2xl font-bold mb-1">All Borrowings</h1>
<p class="text-slate-400 mb-8">Library-wide borrowing activity.</p>

@include('partials.borrowing-list', ['borrowings' => $borrowings, 'showUser' => true])

@endsection
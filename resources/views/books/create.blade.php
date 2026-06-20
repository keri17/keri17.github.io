@extends('layouts.app')
@section('title', 'Add Book — BiblioVerse')

@section('content')

<h1 class="text-2xl font-bold mb-8">Add New Book</h1>

<form action="{{ route('admin.books.store') }}" method="POST" class="max-w-2xl space-y-5">
    @csrf

    <div>
        <label class="block text-sm text-slate-400 mb-1.5">Title</label>
        <input type="text" name="title" value="{{ old('title') }}" required
               class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
    </div>

    <div class="grid grid-cols-2 gap-4">
        <div>
            <label class="block text-sm text-slate-400 mb-1.5">ISBN</label>
            <input type="text" name="isbn" value="{{ old('isbn') }}" required
                   class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
        </div>
        <div>
            <label class="block text-sm text-slate-400 mb-1.5">Published Year</label>
            <input type="number" name="published_year" value="{{ old('published_year') }}"
                   class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
        </div>
    </div>

    <div>
        <label class="block text-sm text-slate-400 mb-1.5">Publisher</label>
        <select name="publisher_id" required
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
            <option value="">Select publisher</option>
            @foreach($publishers as $publisher)
                <option value="{{ $publisher->id }}" {{ old('publisher_id') == $publisher->id ? 'selected' : '' }}>
                    {{ $publisher->name }}
                </option>
            @endforeach
        </select>
    </div>

    <div>
        <label class="block text-sm text-slate-400 mb-1.5">Authors</label>
        <select name="authors[]" multiple required size="5"
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
            @foreach($authors as $author)
                <option value="{{ $author->id }}">{{ $author->name }}</option>
            @endforeach
        </select>
        <p class="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
        <div>
            <label class="block text-sm text-slate-400 mb-1.5">Total Copies</label>
            <input type="number" name="total_copies" value="{{ old('total_copies', 1) }}" min="1" required
                   class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
        </div>
        <div>
            <label class="block text-sm text-slate-400 mb-1.5">Available Copies</label>
            <input type="number" name="available_copies" value="{{ old('available_copies', 1) }}" min="0" required
                   class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
        </div>
    </div>

    <div class="flex items-center gap-3">
        <input type="checkbox" name="is_premium" value="1" id="is_premium" {{ old('is_premium') ? 'checked' : '' }}
               class="w-4 h-4 rounded bg-white/5 border-white/10">
        <label for="is_premium" class="text-sm text-slate-300">Mark as Premium title</label>
    </div>

    <div class="flex gap-3 pt-2">
        <button type="submit"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium hover:opacity-90 transition">
            Save Book
        </button>
        <a href="{{ route('books.index') }}" class="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition">
            Cancel
        </a>
    </div>
</form>

@endsection
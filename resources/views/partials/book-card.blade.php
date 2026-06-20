<div class="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:border-violet-500/40 transition flex flex-col">
    <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-semibold text-slate-100 leading-snug">{{ $book->title }}</h3>
        @if($book->is_premium)
        <span class="shrink-0 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-400/30 text-orange-300">
            Premium
        </span>
        @endif
    </div>

    <p class="text-sm text-slate-400 mb-1">
        {{ $book->authors->pluck('name')->join(', ') ?: 'Unknown author' }}
    </p>
    <p class="text-xs text-slate-500 mb-3">{{ $book->publisher->name ?? 'Unknown publisher' }} · {{ $book->published_year }}</p>

    <div class="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
        <span class="text-xs {{ $book->isAvailable() ? 'text-emerald-400' : 'text-rose-400' }}">
            {{ $book->available_copies }} / {{ $book->total_copies }} available
        </span>
        <a href="{{ route('books.show', $book) }}"
           class="text-xs px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-400/30 text-violet-300 hover:bg-violet-500/30 transition">
            View
        </a>
    </div>
</div>
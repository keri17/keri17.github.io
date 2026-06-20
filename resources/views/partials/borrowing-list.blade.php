@if($borrowings->isEmpty())
<div class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
    No active borrowings right now.
</div>
@else
<div class="space-y-3">
    @foreach($borrowings as $borrowing)
    <div class="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-4
                {{ $borrowing->isOverdue() ? 'border-rose-500/40 bg-rose-500/5' : '' }}">
        <div class="flex-1">
            <p class="font-medium text-slate-100">{{ $borrowing->book->title ?? 'Deleted book' }}</p>

            @if(isset($showUser) && $showUser)
            <p class="text-xs text-slate-500">Borrowed by {{ $borrowing->user->name ?? 'Unknown' }}</p>
            @endif

            <p class="text-xs text-slate-500">
                Borrowed {{ $borrowing->borrowed_at->format('M d, Y') }} ·
                Due {{ $borrowing->due_at->format('M d, Y') }}
            </p>
        </div>

        <div class="text-right shrink-0">
            @if($borrowing->returned_at)
                <span class="text-xs px-3 py-1 rounded-full bg-slate-500/20 text-slate-400">Returned</span>
            @elseif($borrowing->isOverdue())
                <span class="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                    Overdue
                </span>
            @else
                <span class="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {{ $borrowing->daysRemaining() }} days left
                </span>
            @endif
        </div>

        @if(!$borrowing->returned_at)
        <form action="{{ route('borrowings.return', $borrowing) }}" method="POST">
            @csrf
            <button class="text-xs px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-400/30 text-violet-300 hover:bg-violet-500/30 transition">
                Return
            </button>
        </form>
        @endif
    </div>
    @endforeach
</div>

@if($borrowings instanceof \Illuminate\Pagination\AbstractPaginator)
<div class="mt-6">
    {{ $borrowings->links() }}
</div>
@endif
@endif
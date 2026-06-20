<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Borrowing extends Model
{
  protected $fillable = [
    'user_id',
    'book_id',
    'borrowed_at',
    'due_at',
    'returned_at',
    'status',
    'fine_amount', 
    'fine_paid',    
];

    protected $casts = [
        'borrowed_at'  => 'datetime',
        'due_at'       => 'datetime',
        'returned_at'  => 'datetime',
        'fine_paid'    => 'boolean',
        'fine_amount'  => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function isOverdue(): bool
    {
        return $this->status === 'active' && now()->isAfter($this->due_at);
    }

    public function daysRemaining(): int
    {
        return max(0, now()->diffInDays($this->due_at, false));
    }
}
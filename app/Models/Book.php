<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'isbn', 'cover_image_url', 'description',
        'published_year', 'genre', 'is_premium',
        'total_copies', 'available_copies', 'publisher_id',
    ];

    protected $casts = ['is_premium' => 'boolean'];

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(Publisher::class);
    }

    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class, 'author_book')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function borrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class);
    }

    public function activeBorrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class)->where('status', 'active');
    }

    public function isAvailable(): bool
    {
        return $this->available_copies > 0;
    }
}
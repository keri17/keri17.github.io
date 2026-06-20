<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password',
        'role_id', 'avatar_url', 'borrow_limit',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────────────────

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function borrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class);
    }

    public function activeBorrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class)->where('status', 'active');
    }

    public function overdueBorrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class)->where('status', 'overdue');
    }

    // ── Role Checks ────────────────────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role->slug === Role::ADMIN;
    }

    public function isMember(): bool
    {
        return $this->role->slug === Role::MEMBER;
    }

    public function isPremium(): bool
    {
        return $this->role->slug === Role::PREMIUM;
    }

    // ── Borrowing Logic ────────────────────────────────────────────────────────

    public function getBorrowLimit(): int
    {
        return $this->borrow_limit;
    }

    public function getCurrentBorrowCount(): int
    {
        return $this->activeBorrowings()->count();
    }

    public function canBorrowMore(): bool
    {
        return $this->getCurrentBorrowCount() < $this->getBorrowLimit();
    }

    public function getLoanPeriodDays(): int
    {
        return match(true) {
            $this->isAdmin()   => 30,
            $this->isPremium() => 21,
            default            => 14,
        };
    }

    // ── Accessors ──────────────────────────────────────────────────────────────

    public function getAvatarAttribute(): string
    {
        return $this->avatar_url
            ?? 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=random&color=fff&size=128';
    }
}
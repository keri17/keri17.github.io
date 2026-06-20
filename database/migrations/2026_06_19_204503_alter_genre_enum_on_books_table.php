<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE books MODIFY genre ENUM(
            'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
            'Biography', 'Self-Help', 'Mystery', 'Fantasy', 'Romance',
            'Classic Fiction', 'Historical Fiction', 'Dystopian Fiction', 'Satire',
            'Other'
        ) DEFAULT 'Other'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE books MODIFY genre ENUM(
            'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
            'Biography', 'Self-Help', 'Mystery', 'Fantasy', 'Romance', 'Other'
        ) DEFAULT 'Other'");
    }
};
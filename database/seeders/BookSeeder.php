<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Publisher;
use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $penguin = Publisher::create(['name' => 'Penguin Random House', 'country' => 'USA', 'founded_year' => 1935]);
        $harper  = Publisher::create(['name' => 'HarperCollins',        'country' => 'USA', 'founded_year' => 1989]);
        $oreilly = Publisher::create(['name' => "O'Reilly Media",        'country' => 'USA', 'founded_year' => 1978]);

        $orwell  = Author::create(['name' => 'George Orwell',      'nationality' => 'British']);
        $tolkien = Author::create(['name' => 'J.R.R. Tolkien',     'nationality' => 'British']);
        $hawking = Author::create(['name' => 'Stephen Hawking',    'nationality' => 'British']);
        $martin  = Author::create(['name' => 'George R.R. Martin', 'nationality' => 'American']);
        $rcm     = Author::create(['name' => 'Robert C. Martin',   'nationality' => 'American']);
        $fowler  = Author::create(['name' => 'Martin Fowler',      'nationality' => 'British']);

        $books = [
            [
                'data'    => ['title' => '1984', 'isbn' => '978-0-45-228423-4', 'genre' => 'Fiction', 'published_year' => 1949, 'total_copies' => 5, 'is_premium' => false, 'publisher_id' => $penguin->id, 'description' => 'A dystopian novel about totalitarian surveillance.'],
                'authors' => [[$orwell->id, 'Author']],
            ],
            [
                'data'    => ['title' => 'The Hobbit', 'isbn' => '978-0-26-110295-0', 'genre' => 'Fantasy', 'published_year' => 1937, 'total_copies' => 4, 'is_premium' => false, 'publisher_id' => $harper->id, 'description' => 'The adventures of hobbit Bilbo Baggins.'],
                'authors' => [[$tolkien->id, 'Author']],
            ],
            [
                'data'    => ['title' => 'A Brief History of Time', 'isbn' => '978-0-55-338016-3', 'genre' => 'Science', 'published_year' => 1988, 'total_copies' => 3, 'is_premium' => false, 'publisher_id' => $penguin->id, 'description' => 'A popular-science book about cosmology.'],
                'authors' => [[$hawking->id, 'Author']],
            ],
            [
                'data'    => ['title' => 'A Game of Thrones', 'isbn' => '978-0-55-357340-3', 'genre' => 'Fantasy', 'published_year' => 1996, 'total_copies' => 6, 'is_premium' => true, 'publisher_id' => $penguin->id, 'description' => 'First novel of A Song of Ice and Fire.'],
                'authors' => [[$martin->id, 'Author']],
            ],
            [
                'data'    => ['title' => 'Clean Code', 'isbn' => '978-0-13-235088-4', 'genre' => 'Technology', 'published_year' => 2008, 'total_copies' => 8, 'is_premium' => true, 'publisher_id' => $oreilly->id, 'description' => 'A handbook of agile software craftsmanship.'],
                'authors' => [[$rcm->id, 'Author']],
            ],
            [
                'data'    => ['title' => 'Refactoring', 'isbn' => '978-0-20-148567-7', 'genre' => 'Technology', 'published_year' => 2018, 'total_copies' => 5, 'is_premium' => true, 'publisher_id' => $oreilly->id, 'description' => 'Improving the design of existing code.'],
                'authors' => [[$fowler->id, 'Author'], [$rcm->id, 'Co-Author']],
            ],
        ];

        foreach ($books as $entry) {
            $entry['data']['available_copies'] = $entry['data']['total_copies'];
            $book = Book::create($entry['data']);
            foreach ($entry['authors'] as [$authorId, $role]) {
                $book->authors()->attach($authorId, ['role' => $role]);
            }
        }
    }
}
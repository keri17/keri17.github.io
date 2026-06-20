<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name'        => 'Admin',
                'slug'        => 'admin',
                'description' => 'Full system access.',
            ],
            [
                'name'        => 'Member',
                'slug'        => 'member',
                'description' => 'Standard member. Can borrow up to 3 books.',
            ],
            [
                'name'        => 'Premium User',
                'slug'        => 'premium',
                'description' => 'Premium subscriber. Can borrow up to 10 books.',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
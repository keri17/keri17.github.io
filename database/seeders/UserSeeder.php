<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'role_slug'    => 'admin',
                'name'         => 'Alexandria Grant',
                'email'        => 'admin@library.dev',
                'password'     => 'password',
                'avatar_url'   => 'https://api.dicebear.com/8.x/avataaars/svg?seed=Alexandria&backgroundColor=b6e3f4',
                'borrow_limit' => 30,
            ],
            [
                'role_slug'    => 'member',
                'name'         => 'Marcus Webb',
                'email'        => 'member@library.dev',
                'password'     => 'password',
                'avatar_url'   => 'https://api.dicebear.com/8.x/avataaars/svg?seed=Marcus&backgroundColor=c0aede',
                'borrow_limit' => 3,
            ],
            [
                'role_slug'    => 'premium',
                'name'         => 'Sofia Reyes',
                'email'        => 'premium@library.dev',
                'password'     => 'password',
                'avatar_url'   => 'https://api.dicebear.com/8.x/avataaars/svg?seed=Sofia&backgroundColor=ffd5dc',
                'borrow_limit' => 10,
            ],
        ];

        foreach ($users as $userData) {
            $role = Role::where('slug', $userData['role_slug'])->firstOrFail();

            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name'         => $userData['name'],
                    'password'     => Hash::make($userData['password']),
                    'role_id'      => $role->id,
                    'avatar_url'   => $userData['avatar_url'],
                    'borrow_limit' => $userData['borrow_limit'],
                ]
            );
        }
    }
}
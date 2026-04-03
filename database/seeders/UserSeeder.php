<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ronjoo.com'],
            [
                'name'     => 'Ronjoo Admin',
                'email'    => 'admin@ronjoo.com',
                'role'     => 'super-admin',
                'password' => Hash::make('admin1234'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'editor@ronjoo.com'],
            [
                'name'     => 'Content Editor',
                'email'    => 'editor@ronjoo.com',
                'role'     => 'content-editor',
                'password' => Hash::make('editor1234'),
            ]
        );
    }
}

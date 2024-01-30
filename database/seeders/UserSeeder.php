<?php

namespace Database\Seeders;


use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'admin',
            'paternal' => 'admin',
            'maternal' => 'admin',
            'fecha_nac' => '2012-12-12',
            'departamento' => 'admin',
            'provincia' => 'admin',
            'distrito' => 'admin',
            'dni' => '99999999',
            'email' => 'admin@admin.com',
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'current_address' => 'Here',
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'remember_token' => Str::random(10),
            'profile_photo_path' => null,
            'current_team_id' => null,
        ])->assignRole('admin');

        User::create([
            'name' => 'manager',
            'paternal' => 'manager',
            'maternal' => 'manager',
            'fecha_nac' => '2012-12-12',
            'departamento' => 'manager',
            'provincia' => 'manager',
            'distrito' => 'manager',
            'dni' => '88888888',
            'email' => 'manager@manager.com',
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'current_address' => 'Here',
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'remember_token' => Str::random(10),
            'profile_photo_path' => null,
            'current_team_id' => null,
        ])->assignRole('manager');


        User::create([
            'name' => 'teacher',
            'paternal' => 'teacher',
            'maternal' => 'teacher',
            'fecha_nac' => '2012-12-12',
            'departamento' => 'teacher',
            'provincia' => 'teacher',
            'distrito' => 'teacher',
            'dni' => '77777777',
            'email' => 'teacher@teacher.com',
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'current_address' => 'Here',
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'remember_token' => Str::random(10),
            'profile_photo_path' => null,
            'current_team_id' => null,
        ])->assignRole('teacher');
    }
}

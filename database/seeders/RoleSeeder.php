<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin => All
        // Manager => Ver listado de usuarios
        // student => Ver listado de estudiantes
        $admin = Role::create(['name' => 'admin']);
        $manager = Role::create(['name' => 'manager']);
        $student = Role::create(['name' => 'student']);

        Permission::create(['name' => 'dashboard'])->assignRole(['admin', 'manager', 'student']);
        Permission::create(['name' => 'user.index'])->assignRole(['admin', 'manager']);
        Permission::create(['name' => 'user.store'])->assignRole(['admin', 'manager']);
        Permission::create(['name' => 'user.update'])->assignRole(['admin', 'manager']);
        Permission::create(['name' => 'user.destroy'])->assignRole(['admin', 'manager']);
        Permission::create(['name' => 'estudiantes.index'])->assignRole(['admin', 'manager', 'student']);
        Permission::create(['name' => 'estudiantes.store'])->assignRole(['admin', 'manager', 'student']);
        Permission::create(['name' => 'estudiantes.update'])->assignRole(['admin', 'manager', 'student']);
        Permission::create(['name' => 'estudiantes.destroy'])->assignRole(['admin', 'manager', 'student']);
    }
}

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
        $teacher = Role::create(['name' => 'teacher']);

        Permission::create(['name' => 'dashboard'])->syncRoles([$admin, $manager, $student, $teacher]);
        Permission::create(['name' => 'user.index'])->syncRoles([$admin, $manager]);
        Permission::create(['name' => 'user.store'])->syncRoles($admin);
        Permission::create(['name' => 'user.update'])->syncRoles([$admin, $manager]);
        Permission::create(['name' => 'user.destroy'])->syncRoles($admin);
        Permission::create(['name' => 'user.multipleDestroy'])->syncRoles($admin);
        Permission::create(['name' => 'estudiantes.index'])->syncRoles([$admin, $manager, $teacher, $student]);
        Permission::create(['name' => 'estudiantes.store'])->syncRoles([$admin, $manager]);
        Permission::create(['name' => 'estudiantes.update'])->syncRoles([$admin, $manager, $teacher]);
        Permission::create(['name' => 'estudiantes.destroy'])->syncRoles([$admin, $manager]);
        Permission::create(['name' => 'estudiantes.multipleDestroy'])->syncRoles([$admin, $manager]);
    }
}

<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    // ... (otros métodos)

    public function share(Request $request): array
    {
        $user = $request->user();

        // Define roles y permisos como vacíos por defecto
        $roles = [];
        $permissions = [];

        if ($user) {
            // Usar métodos proporcionados por el trait HasRoles
            $roles = $user->getRoleNames(); // Obtiene los nombres de los roles
            $permissions = $user->getAllPermissions()->pluck('name'); // Obtiene los nombres de todos los permisos
        }

        return array_merge(parent::share($request), [
            'ziggy' => function () {
                return array_merge((new Ziggy)->toArray(), ['location' => url()->current()]);
            },
            'auth' => [
                'user' => $user ? $user->only('id', 'name', 'email') : null,
                'roles' => $roles,
                'permissions' => $permissions,
            ],
        ]);
    }
}

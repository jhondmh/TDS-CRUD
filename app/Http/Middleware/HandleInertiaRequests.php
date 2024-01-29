<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            // Agregar roles y permisos del usuario autenticado
            'auth' => function () use ($request) {
                return [
                    'user' => $request->user() ? $request->user()->only('id', 'name', 'email', 'roleNames', 'permissionNames') : null,
                    'roles' => optional($request->user())->roleNames ?? [],
                    'permissions' => optional($request->user())->permissionNames ?? [],
                ];
            },
        ];
    }
}

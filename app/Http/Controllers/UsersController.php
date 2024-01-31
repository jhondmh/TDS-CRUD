<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;


class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:user.index')->only('index');
        $this->middleware('can:user.store')->only('store');
        $this->middleware('can:user.update')->only('update');
        $this->middleware('can:user.Destroy')->only('Destroy');
        $this->middleware('can:user.multipleDestroy')->only('multipleDestroy');
    }

    public function index()
    {
        $users = User::all();
        return Inertia::render('User/Index', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:25', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            // 'surname' => ['required', 'string', 'max:255'],
            'paternal' => ['required', 'string', 'max:15', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'maternal' => ['required', 'string', 'max:15', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'fecha_nac' => ['required', 'date', 'after:1950-01-01', 'before_or_equal:today'],
            'departamento' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'provincia' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'distrito' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'current_address' => ['required', 'string', 'max:70', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,()-]+$/'],

            'dni' => ['required', 'size:8', 'regex:/^[0-9]+$/', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:40', 'unique:users'],
            'password' => ['required', 'string'],
        ]);
        // $user = new User($request->input());
        // $user->save();
        $user = new User($request->only('name', 'paternal', 'maternal', 'fecha_nac', 'departamento', 'provincia', 'distrito', 'current_address', 'dni', 'email'));
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['user' => $user]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:25', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            // 'surname' => ['required', 'string', 'max:255'],
            'paternal' => ['required', 'string', 'max:15', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'maternal' => ['required', 'string', 'max:15', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'fecha_nac' => ['required', 'date', 'after:1950-01-01', 'before_or_equal:today'],
            'departamento' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'provincia' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'distrito' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'current_address' => ['required', 'string', 'max:70', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,()-]+$/'],


            'dni' => ['required', 'size:8', 'regex:/^[0-9]+$/', Rule::unique('users')->ignore($id)],
            'email' => ['required', 'string', 'email', 'max:40', Rule::unique('users')->ignore($id)],

            'password' => ['required', 'string'],
        ]);
        // $user = User::find($id);
        // $user->fill($request->input())->saveOrFail();
        $user = User::find($id);
        $user->fill($request->only('name', 'paternal', 'maternal', 'fecha_nac', 'departamento', 'provincia', 'distrito', 'current_address', 'dni', 'email'));
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->saveOrFail();


        return response()->json(['user' => $user]);
    }

    public function destroy($id)
{
    Log::info("Método destroy llamado con ID: $id");
    $user = User::find($id);

    if (!$user) {
        return response()->json(['error' => 'Usuario no encontrado.'], 404);
    }

    $user->delete();

    return response()->json(['success' => 'Usuario eliminado con éxito.']);
}

public function multipleDestroy(Request $request)
{
    $ids = $request->input('ids');

    if (empty($ids)) {
        return response()->json(['error' => 'No se proporcionaron IDs válidos.'], 400);
    }

    try {
        User::whereIn('id', $ids)->delete();
        return response()->json(['success' => 'Usuarios eliminados con éxito.']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al eliminar usuarios.'], 500);
    }
}
}

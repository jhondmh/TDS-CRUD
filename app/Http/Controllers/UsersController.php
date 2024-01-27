<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;


class UsersController extends Controller
{

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


            'dni' => ['required', 'size:8', 'regex:/^[0-9]+$/', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:40', 'unique:users'],
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
        $user->delete();
        // return redirect('users');

        return response()->json(['user' => $user]);
    }

    public function multipleDestroy(Request $request)
    {
        // Log::info("Método multipleDestroy llamado");
        $ids = $request->input('ids');

        if ($ids === null || count($ids) === 0) {
            return response()->json(['error' => 'No se proporcionaron IDs válidos.'], 400);
            // return redirect()->back()->with('error', 'No se proporcionaron IDs válidos.');
        }


        // DB::beginTransaction();
        try {
            User::whereIn('id', $ids)->delete();
            // $users = User::all(); // Recuperar datos actualizados
            // DB::commit();
            return response()->json(['success' => 'User eliminados con éxito.']);
            // return redirect('users');
            // return response()->json(['success' => 'User eliminados con éxito.']);
            // return Inertia::render('User/Index', ['users' => $users]);
        } catch (\Exception $e) {
            // DB::rollBack();
            // Log::error("Error al eliminar users: " . $e->getMessage());
            // return response()->json(['error' => 'Error al eliminar users.'], 500);
            return response()->json(['error' => 'Error al eliminar users.'], 500);
        }
    }
}

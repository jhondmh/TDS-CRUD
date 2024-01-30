<?php

namespace App\Http\Controllers;

use App\Models\Estudiantes;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class EstudiantesController extends Controller
{

    public function __construct()
    {
        $this->middleware('can:estudiantes.index')->only('index');
        $this->middleware('can:estudiantes.store')->only('store');
        $this->middleware('can:estudiantes.update')->only('update');
        $this->middleware('can:estudiantes.Destroy')->only('Destroy');
        $this->middleware('can:estudiantes.multipleDestroy')->only('multipleDestroy');
    }
    public function index()
    {
        // $estudiantes = Estudiantes::all();
        // return Inertia::render('Estudiantes/Index', [
        //     'estudiantes' => $estudiantes
        // ]);
        // Carga los estudiantes y también la información del usuario relacionado
        $estudiantes = Estudiantes::with('user')->get();

        return Inertia::render('Estudiantes/Index', [
            'estudiantes' => $estudiantes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            // 'nombre' => 'required|max:25',
            // 'apellido_pat' => 'required|max:15',
            // 'apellido_mat' => 'required|max:15',
            // 'fecha_nac' => 'required|date|after:1950-01-01|before_or_equal:today',
            // 'nota1' => 'required|integer|between:0,20',
            // 'nota2' => 'required|integer|between:0,20',
            // 'nota3' => 'required|integer|between:0,20',
            'nota1' => 'sometimes|nullable|integer|between:0,20',
            'nota2' => 'sometimes|nullable|integer|between:0,20',
            'nota3' => 'sometimes|nullable|integer|between:0,20',

            // 'departamento' => 'required|max:25',
        ]);
        // $estudiante = new Estudiantes($request->input());
        $estudiante = new Estudiantes($request->only(['user_id', 'nota1', 'nota2', 'nota3']));

        $estudiante->save();
        // return redirect('estudiantes');

        // Devuelve una respuesta Inertia con el estudiante recién creado
        // return Inertia::render('Estudiantes/Index', [
        //     'estudiante' => $estudiante,
        //     'estudiantes' => Estudiantes::all() // Opcional: devuelve también la lista actualizada
        // ]);
        return response()->json(['estudiante' => $estudiante]);
    }

    public function update(Request $request, $id)
    {
        // dd($request->all());
        $request->validate([
            // 'id' => 'required|exists:users,id',
            // 'nombre' => 'required|max:25',
            // 'apellido_pat' => 'required|max:15',
            // 'apellido_mat' => 'required|max:15',
            // 'fecha_nac' => 'required|date|after:1950-01-01|before_or_equal:today',
            // 'nota1' => 'required|integer|between:0,20',
            // 'nota2' => 'required|integer|between:0,20',
            // 'nota3' => 'required|integer|between:0,20',
            'nota1' => 'sometimes|nullable|integer|between:0,20',
            'nota2' => 'sometimes|nullable|integer|between:0,20',
            'nota3' => 'sometimes|nullable|integer|between:0,20',
            // 'departamento' => 'required|max:25',
        ]);
        // $estudiante = Estudiantes::find($id);
        // // $estudiante = Estudiantes::findOrFail($id);
        // $estudiante->fill($request->input())->saveOrFail();
        // // $estudiante->fill($request->only(['user_id', 'nota1', 'nota2', 'nota3']))->saveOrFail();
        // // $estudiante = Estudiantes::where('user_id', $request->user_id)->firstOrFail();
        // $estudiante = Estudiantes::with('user')->findOrFail($id);
        // $estudiante->fill($request->input())->saveOrFail();
        $estudiante = Estudiantes::findOrFail($id);
        $estudiante->fill($request->only(['nota1', 'nota2', 'nota3']))->saveOrFail();

        // Buscar el usuario asociado al estudiante.
        $user = $estudiante->user;
        $user->name = $request->input('name', $user->name);
        $user->paternal = $request->input('paternal', $user->paternal);
        $user->maternal = $request->input('maternal', $user->maternal);
        $user->fecha_nac = $request->input('fecha_nac', $user->fecha_nac);
        $user->departamento = $request->input('departamento', $user->departamento);
        $user->provincia = $request->input('provincia', $user->provincia);
        $user->distrito = $request->input('distrito', $user->distrito);
        $user->current_address = $request->input('current_address', $user->current_address);
        $user->dni = $request->input('dni', $user->dni);
        $user->email = $request->input('email', $user->email);
        $user->password = $request->input('password', $user->password);

        // Verificar si se enviaron datos para actualizar el usuario.
        // Ajusta los campos según la información que quieres actualizar.
        if ($request->hasAny(['name', 'paternal', 'maternal', 'fecha_nac', 'departamento', 'provincia', 'distrito', 'current_address', 'dni', 'email', 'password'])) {
            // Validar la información del usuario si es necesario.
            // Puedes hacerlo aquí o asegurarte de que se valide antes de llegar a este punto.

            // Actualizar la información del usuario.
            $user->fill($request->only(['name', 'paternal', 'maternal', 'fecha_nac', 'departamento', 'provincia', 'distrito', 'current_address', 'dni', 'email', 'password']));
            $user->saveOrFail();
        }

        // return redirect('estudiantes');
        // return Inertia::render('Estudiantes/Index', [
        //     'estudiante' => $estudiante,
        //     'estudiantes' => Estudiantes::all() // Opcional: devuelve también la lista actualizada
        // ]);
        // return response()->json(['estudiante' => $estudiante]);
        return response()->json(['estudiante' => $estudiante->load('user')]);
    }

    public function destroy($id)
    {
        Log::info("Método destroy llamado con ID: $id");
        $estudiante = Estudiantes::find($id);
        $estudiante->delete();
        // return redirect('estudiantes');

        return response()->json(['estudiante' => $estudiante]);
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
            Estudiantes::whereIn('id', $ids)->delete();
            // $estudiantes = Estudiantes::all(); // Recuperar datos actualizados
            // DB::commit();
            return response()->json(['success' => 'Estudiantes eliminados con éxito.']);
            // return redirect('estudiantes');
            // return response()->json(['success' => 'Estudiantes eliminados con éxito.']);
            // return Inertia::render('Estudiantes/Index', ['estudiantes' => $estudiantes]);
        } catch (\Exception $e) {
            // DB::rollBack();
            // Log::error("Error al eliminar estudiantes: " . $e->getMessage());
            // return response()->json(['error' => 'Error al eliminar estudiantes.'], 500);
            return response()->json(['error' => 'Error al eliminar estudiantes.'], 500);
        }
    }
}

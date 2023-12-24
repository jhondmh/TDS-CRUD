<?php

namespace App\Http\Controllers;

use App\Models\Estudiantes;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class EstudiantesController extends Controller
{

    public function index()
    {
        $estudiantes = Estudiantes::all();
        return Inertia::render('Estudiantes/Index', [
            'estudiantes' => $estudiantes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|max:25',
            'apellido_pat' => 'required|max:15',
            'apellido_mat' => 'required|max:15',
            'fecha_nac' => 'required|date|after:1950-01-01|before:today',
        ]);
        $estudiante = new Estudiantes($request->input());
        $estudiante->save();
        return redirect('estudiantes');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|max:25',
            'apellido_pat' => 'required|max:15',
            'apellido_mat' => 'required|max:15',
            'fecha_nac' => 'required|date|after:1950-01-01|before:today',
        ]);
        $estudiante = Estudiantes::find($id);
        $estudiante->fill($request->input())->saveOrFail();
        return redirect('estudiantes');
    }

    public function destroy($id)
    {
        Log::info("Método destroy llamado con ID: $id");
        $estudiante = Estudiantes::find($id);
        $estudiante->delete();
        return redirect('estudiantes');
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

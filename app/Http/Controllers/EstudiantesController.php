<?php

namespace App\Http\Controllers;

use App\Models\Estudiantes;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        $estudiante = Estudiantes::find($id);
        $estudiante->delete();
        return redirect('estudiantes');
    }
}

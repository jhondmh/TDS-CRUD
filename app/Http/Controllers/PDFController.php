<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
//use PDF;
//use Barryvdh\DomPDF\PDF as PDF ;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Illuminate\Support\Facades\DB;

use Symfony\Component\Process\Process;

class PDFController extends Controller
{

    public function createUsersPdf(Request $request)
    {
        try {

            $data = [
                'usuarios' => DB::table("users")->get()
            ];
            $pdfNombre = "Academa de programacion extrema -  Lista de usuarios.pdf";
            PDF::setOption([
                'defaultFont' => 'arial'
            ]);
            $pdf = PDF::loadView('pdf.pdftemplateUsuarios', $data);
            $pdf->setPaper('A4', 'portrait');
            $pdf->setOptions([
                'isPhpEnabled' => true,
                'isRemoteEnabled' => true,
                'margin_top' => 0,
                'margin_right' => 0,
                'margin_bottom' => 0,
                'margin_left' => 0,
            ]);
            return $pdf->stream($pdfNombre);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        }
    }

    public function createNotasPdf(Request $request)
    {
        try {

            $data = [
                'notas' => DB::table('estudiantes')
                    ->join('users', 'estudiantes.user_id', '=', 'users.id')
                    ->select('estudiantes.*', 'users.*')
                    ->get()
            ];
            $pdfNombre = "Academa de programacion extrema -  Lista de notas.pdf";
            PDF::setOption([
                'defaultFont' => 'arial'
            ]);
            $pdf = PDF::loadView('pdf.pdftemplateNotas', $data);
            $pdf->setPaper('A4', 'portrait');
            $pdf->setOptions([
                'isPhpEnabled' => true,
                'isRemoteEnabled' => true,
                'margin_top' => 0,
                'margin_right' => 0,
                'margin_bottom' => 0,
                'margin_left' => 0,
            ]);
            return $pdf->stream($pdfNombre);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        }
    }
}

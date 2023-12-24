<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estudiantes extends Model
{
    use HasFactory;
    protected $fillable = ['nombre', 'apellido_pat', 'apellido_mat', 'fecha_nac', 'nota1', 'departamento'];
}

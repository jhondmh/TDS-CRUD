<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estudiantes extends Model
{
    use HasFactory;
    // protected $fillable = ['nombre', 'apellido_pat', 'apellido_mat', 'fecha_nac', 'nota1', 'nota2', 'nota3', 'departamento'];
    protected $fillable = ['user_id', 'nota1', 'nota2', 'nota3'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

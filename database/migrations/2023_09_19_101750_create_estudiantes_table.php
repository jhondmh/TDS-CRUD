<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // public function up(): void
    // {
    //     Schema::create('estudiantes', function (Blueprint $table) {
    //         $table->id();
    //         $table->string('nombre',25);
    //         $table->string('apellido_pat',15);
    //         $table->string('apellido_mat',15);
    //         $table->date('fecha_nac');
    //         $table->unsignedInteger('nota1');
    //         $table->unsignedInteger('nota2');
    //         $table->unsignedInteger('nota3');
    //         $table->string('departamento',25);
    //         $table->timestamps();
    //     });
    // }
    public function up(): void
    {
        Schema::create('estudiantes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relaciona a la tabla users
            $table->unsignedInteger('nota1')->nullable();
            $table->unsignedInteger('nota2')->nullable();
            $table->unsignedInteger('nota3')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudiantes');
    }
};

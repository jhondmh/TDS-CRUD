<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 25);
            // $table->string('surname');
            $table->string('paternal', 15);
            $table->string('maternal', 15);
            $table->char('dni', 8)->unique();
            $table->string('email', 40)->unique();

            $table->string('departamento', 30);
            $table->string('provincia', 30);
            $table->string('distrito', 30);

            $table->string('current_address', 70);

            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();

            $table->string('google_id')->nullable();
            $table->string('facebook_id')->nullable();

            $table->rememberToken();
            $table->foreignId('current_team_id')->nullable();
            $table->string('profile_photo_path', 2048)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

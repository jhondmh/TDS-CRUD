<?php

namespace Database\Factories;

use App\Models\Estudiantes;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Estudiantes>
 */
class EstudiantesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->firstName(),
            'apellido_pat' => $this->faker->lastName(),
            'apellido_mat' => $this->faker->lastName(),
            'fecha_nac' => $this->faker->date($format = 'Y-m-d', $max = 'now'),
        ];
    }
}

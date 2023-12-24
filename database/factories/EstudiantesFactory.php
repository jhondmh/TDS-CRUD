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
        $departamentos = ['Puno', 'Arequipa', 'Lima'];

        return [
            'nombre' => $this->faker->firstName(),
            'apellido_pat' => $this->faker->lastName(),
            'apellido_mat' => $this->faker->lastName(),
            'fecha_nac' => $this->faker->date($format = 'Y-m-d', $max = 'now'),
            'nota1' => $this->faker->numberBetween($min = 0, $max = 20),
            'departamento' => $this->faker->randomElement($departamentos),
        ];
    }
}

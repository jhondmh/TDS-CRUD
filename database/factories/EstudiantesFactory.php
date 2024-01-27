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
            'nombre' => strtoupper($this->faker->firstName()),
            'apellido_pat' => strtoupper($this->faker->lastName()),
            'apellido_mat' => strtoupper($this->faker->lastName()),
            'fecha_nac' => $this->faker->date($format = 'Y-m-d', $max = 'now'),
            'nota1' => $this->faker->numberBetween($min = 0, $max = 20),
            'nota2' => $this->faker->numberBetween($min = 0, $max = 20),
            'nota3' => $this->faker->numberBetween($min = 0, $max = 20),
            'departamento' => $this->faker->randomElement($departamentos),
        ];
    }
}

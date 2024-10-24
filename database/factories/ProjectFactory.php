<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => 1,
            'name' => $this->faker->name,
            'description' => $this->faker->text,
            'short_description' => $this->faker->text,
            'start_date' => $this->faker->date,
            'end_date' => $this->faker->date,
            'budget' => $this->faker->randomFloat(2, 1000, 100000),
            'url' => $this->faker->url,
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Project;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobList>
 */
class JobListFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $randomID = Project::inRandomOrder()->first()->id;
        return [
            'project_id' => $randomID,
            'title' => $this->faker->jobTitle,
            'minimum_salary' => $this->faker->randomFloat(2, 1000, 10000),
            'maximum_salary' => $this->faker->randomFloat(2, 10000, 100000),
            'years_of_experience' => $this->faker->numberBetween(1, 10),
            'skills' => $this->faker->words(5),
            'description' => $this->faker->text,
            'thumbnail' => $this->faker->imageUrl(640, 480, 'cats', true)
        ];
    }
}

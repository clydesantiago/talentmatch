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
            'job_title' => $this->faker->name,
            'job_description' => Str::random(20),
            'job_role' => Str::random(20),
        ];
    }
}

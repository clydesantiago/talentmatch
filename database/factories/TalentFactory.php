<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Talent>
 */
class TalentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug,
            'name' => $this->faker->name,
            'thumbnail' => $this->faker->imageUrl(),
            'summary' => $this->faker->text,
            'job_title' => $this->faker->jobTitle,
            'email' => $this->faker->email,
            'phone' => $this->faker->phoneNumber,
            'monthly_salary' => $this->faker->randomFloat(2, 1000, 10000),
            'years_of_experience' => $this->faker->numberBetween(1, 10),
            'resume' => $this->faker->url,
            'skills' => $this->faker->words(5),
        ];
    }
}

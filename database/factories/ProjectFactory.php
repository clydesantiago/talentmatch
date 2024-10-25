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
            'thumbnail' => $this->faker->imageUrl(),
        ];
    }

    /**
     * Generate a random start date between October 25 and December 25.
     */
    private function randomStartDate()
    {
        $start = Carbon::createFromDate(2024, 10, 25);
        $end = Carbon::createFromDate(2024, 12, 25);
        return Carbon::createFromTimestamp(rand($start->timestamp, $end->timestamp))->toDateString();
    }

    /**
     * Generate a random end date X months from the start date (between 1 to 12 months).
     */
    private function randomEndDate()
    {
        $months = rand(1, 12); // Random duration between 1 and 12 months
        return Carbon::now()->addMonths($months)->toDateString();
    }

    /**
     * Generate a random budget between 50,000 and 500,000 USD.
     */
    private function randomBudget()
    {
        return rand(50000, 500000); // Random budget in USD
    }
}

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
        Schema::create('talent', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('thumbnail')->nullable();
            $table->text('summary')->nullable();
            $table->string('job_title');
            $table->string('email');
            $table->string('phone');
            $table->float('monthly_salary');
            $table->integer('years_of_experience');
            $table->string('resume')->nullable();
            $table->json('skills');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('talent');
    }
};

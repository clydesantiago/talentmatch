<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Talent extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'thumbnail',
        'summary',
        'job_title',
        'email',
        'phone',
        'monthly_salary',
        'years_of_experience',
        'resume',
        'skills',
    ];

    protected $casts = [
        'skills' => 'array',
    ];
}

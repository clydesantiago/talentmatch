<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobList extends Model
{
    use HasFactory;

    protected $table = 'job_list';
    
    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'project_id',
        'title',
        'minimum_salary',
        'maximum_salary',
        'years_of_experience',
        'skills',
        'description',
        'thumbnail'
    ];

    /**
     * casts
     *
     * @var array
     */
    protected $casts = [
        'skills' => 'array'
    ];
}

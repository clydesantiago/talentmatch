<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobList extends Model
{
    protected $table = 'job_list';
    //
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'role',
    ];
}

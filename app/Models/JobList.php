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
        'job_title',
        'job_description',
        'job_role',
    ];
}

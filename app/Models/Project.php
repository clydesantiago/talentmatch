<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{    
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'company_id',
        'name',
        'description',
        'short_description',
        'start_date',
        'end_date',
        'budget',
        'thumbnail',
    ];
    
    /**
     * Get the company that owns the project.
     *
     * @return void
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}

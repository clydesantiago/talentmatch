<?php

namespace App\Http\Controllers;

use App\Models\Talent;
use Str;
use Illuminate\Http\Request;

class TalentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Talent::latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'thumbnail' => 'nullable',
            'name' => 'required',
            'job_title' => 'required',
            'email' => 'required',
            'phone' => 'required',
            'summary' => 'nullable',
            'monthly_salary' => 'required|numeric',
            'years_of_experience' => 'required|integer',
            'resume' => 'nullable',
            'skills' => 'required',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $slugExists = Talent::where('slug', $validated['slug'])->exists();

        if ($slugExists) {
            $validated['slug'] = $validated['slug'] . '-' . Str::random(5);
        }

        return Talent::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Talent $talent)
    {
        return $talent;
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Talent $talent)
    {
        $validated = $request->validate([
            'thumbnail' => 'nullable',
            'name' => 'required',
            'job_title' => 'required',
            'email' => 'required',
            'phone' => 'required',
            'summary' => 'nullable',
            'monthly_salary' => 'required|numeric',
            'years_of_experience' => 'required|integer',
            'resume' => 'nullable',
            'skills' => 'required',
        ]);

        return $talent->update($validated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Talent $talent)
    {
        //
    }
}

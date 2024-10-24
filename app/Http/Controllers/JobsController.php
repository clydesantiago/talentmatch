<?php

namespace App\Http\Controllers;
use App\Http\Requests\JobListRequest;
use App\Models\JobList;
use Illuminate\Http\Request;

class JobsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return JobList::latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'minimum_salary' => 'required|numeric',
            'maximum_salary' => 'required|numeric',
            'years_of_experience' => 'required|integer',
            'skills' => 'required|array',
            'description' => 'required|string',
            'thumbnail' => 'nullable|string',
        ]);

        $joblist = Joblist::create($validated);
        return response($joblist, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobList $jobList)
    {
        return $jobList;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

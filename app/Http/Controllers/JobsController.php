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
        //
        return JobList::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        logger()->info('---- JOB LIST REQUEST -----');
        logger()->info($request);

        $validated = $request->validate([
            'job_title' => 'required',
            'job_description' => 'nullable',
            'job_role' => 'nullable',
        ]);

        $joblist = Joblist::create($validated);
        return response($joblist, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        return response()->json([
            'success' => true,
            'show' => true,
        ]);
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

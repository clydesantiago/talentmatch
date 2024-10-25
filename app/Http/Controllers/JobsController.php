<?php

namespace App\Http\Controllers;
use App\Http\Requests\JobListRequest;
use App\Models\JobList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helper\Helper;

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
    
    /**
     * findTalents
     *
     * @param  mixed $request
     * @return void
     */
    public function findTalents(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|string',
        ]);
        $job = JobList::find($validated['job_id']);

        // Round 1: Match job title and skills
        $matchedTalents = collect();
        
        // Start with a broad match using orWhere for job title and skills
        $query = DB::table('talent')
            ->where(function($query) use ($job) {
                // Match job title
                $query->where(DB::raw('LOWER(job_title)'), 'like', '%' . strtolower($job->title) . '%');
                
                // Match skills
                foreach (($job->skills) as $skill) {
                    $query->orWhereJsonContains('skills', strtolower($skill));  // Use lowercase for skills
                }
            });

        // Try the initial query
        $talents = $query->get();

        // If no results, relax skill matching (e.g., allow for broader matches)
        if ($talents->isEmpty()) {
            $talents = DB::table('talent')
                ->where(function ($query) use ($job) {
                    $query->where(DB::raw('LOWER(job_title)'), 'like', '%' . strtolower($job->title) . '%')
                        ->orWhere(function($query) use ($job) {
                            // Allow for more flexible matching on skills
                            foreach (($job->skills) as $skill) {
                                $query->orWhereJsonContains('skills', strtolower($skill));
                            }
                        });
                })
                ->get();
        }

        // Merge matched talents
        $matchedTalents = $matchedTalents->merge($talents);
        
        // Round 2: Suggest AI
        $result = Helper::runAssistant('asst_AlWa8baHifdNYp9fSzZwp2VZ', json_encode([
            'job_title' => $job->title,
            'skills' => ($job->skills),
            'job_description' => $job->description
        ]));

        $suggestedJobTitles = $result['suggestions'];

        // Do another round of matching using the suggested job titles
        foreach ($suggestedJobTitles as $suggestedJobTitle) {
            $query = DB::table('talent')
                ->where(function($query) use ($suggestedJobTitle) {
                    // Match job title
                    $query->where(DB::raw('LOWER(job_title)'), 'like', '%' . strtolower($suggestedJobTitle) . '%');
                });

            // Try the initial query
            $talents = $query->get();

            // If no results, relax skill matching (e.g., allow for broader matches)
            if ($talents->isEmpty()) {
                $talents = DB::table('talent')
                    ->where(function ($query) use ($suggestedJobTitle) {
                        $query->where(DB::raw('LOWER(job_title)'), 'like', '%' . strtolower($suggestedJobTitle) . '%');
                    })
                    ->get();
            }

            // Merge matched talents
            $matchedTalents = $matchedTalents->merge($talents);
        }

        // Make sure id is unique and limit to 20
        $matchedTalents = $matchedTalents->unique('id')->take(20);

        // Round 3: Sort AI
        $sortResult = Helper::runAssistant('asst_1RV5BwMfTCIVqjF7CdXdDEzD', json_encode([
            'job' => $job,
            'talents' => $matchedTalents->pluck('id')->toArray()
        ]));

        // Get the final talents and add match percentage to the collection
        $finalTalents = collect($sortResult['finalTalents']);
        $matchedTalents = $matchedTalents->whereIn('id', $finalTalents->pluck('id'));

        // Add match percentage to the collection
        $matchedTalents = $matchedTalents->map(function ($talent) use ($finalTalents) {
            $talent->match_percentage = $finalTalents->where('id', $talent->id)->first()['match_percentage'];
            return $talent;
        });
        
        // Reverse sort by match percentage
        $matchedTalents = $matchedTalents->sortByDesc('match_percentage');

        return $matchedTalents->values()->toArray();
    }
}

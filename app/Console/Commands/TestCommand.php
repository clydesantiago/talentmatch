<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\PdfToText\Pdf;
use App\Models\Talent;
use App\Helper\Helper;
use Illuminate\Support\Facades\DB;

class TestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // $talent = Talent::findOrfail(11);
        // $resume = public_path($talent->resume);
        // $extractedText = Pdf::getText($resume);
        // $result = Helper::runAssistant('asst_zjmUA8lBae3IBt0pvc5qFSYa', $extractedText);

        // dd($result);

        $jobs = DB::table('job_list')->offset(1)->limit(1)->get();  // Fetch all jobs

        $matchedTalents = collect();

        foreach ($jobs as $job) {
            // Start with a broad match using orWhere for job title and skills
            $query = DB::table('talent')
                ->where(function($query) use ($job) {
                    // Match job title
                    $query->where(DB::raw('LOWER(job_title)'), 'like', '%' . strtolower($job->title) . '%');
                    
                    // Match skills
                    foreach (json_decode($job->skills) as $skill) {
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
                                foreach (json_decode($job->skills) as $skill) {
                                    $query->orWhereJsonContains('skills', strtolower($skill));
                                }
                            });
                    })
                    ->get();
            }

            // Merge matched talents
            $matchedTalents = $matchedTalents->merge($talents);
        }
        
        // Suggest ai
        $result = Helper::runAssistant('asst_AlWa8baHifdNYp9fSzZwp2VZ', json_encode([
            'job_title' => $jobs[0]->title,
            'skills' => json_decode($jobs[0]->skills),
            'job_description' => $jobs[0]->description
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

        // Make sure id is unique and limit to 10
        $matchedTalents = $matchedTalents->unique('id')->take(20);

        // Sort AI
        $sortResult = Helper::runAssistant('asst_1RV5BwMfTCIVqjF7CdXdDEzD', json_encode([
            'job' => $jobs[0],
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
    }
}

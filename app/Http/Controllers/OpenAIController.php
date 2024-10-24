<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;

class OpenAIController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'messages' => 'required|array',
        ]);

        $result = OpenAI::chat()->create([
            'model' => 'gpt-4o',
            'messages' => $validated['messages'],
        ]);

        return response()->json([
            'message' => $result['choices'][0]['message']['content'],
        ]);
    }
}

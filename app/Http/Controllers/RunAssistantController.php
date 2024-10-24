<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helper\Helper;

class RunAssistantController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'assistant_id' => 'required',
            'message' => 'required',
        ]);
        $result = Helper::runAssistant($validated['assistant_id'], $validated['message']);

        return response()->json([
            'result' => $result,
        ]);
    }
}

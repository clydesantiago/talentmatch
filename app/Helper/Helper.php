<?php

namespace App\Helper;

use OpenAI\Laravel\Facades\OpenAI;

class Helper
{
    /**
     * Run OpenAI assistant.
     *
     * @param  mixed  $assistantId
     * @param  mixed  $message
     * @return void
     */
    public static function runAssistant($assistantId, $message)
    {
        $threads = OpenAI::threads();
        $runs = 0;
        $maxRuns = 15;

        $runResponse = $threads->createAndRun([
            'assistant_id' => $assistantId,
            'thread' => [
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $message,
                    ],
                ],
            ],
        ]);

        while (! $runResponse->completedAt && $runs < $maxRuns) {
            sleep(2);
            $runResponse = $threads->runs()->retrieve(
                threadId: $runResponse->threadId,
                runId: $runResponse->id
            );

            $runs++;
        }

        if (! $runResponse->completedAt) {
            throw new \Exception('Failed to get the response from the assistant.');
        }

        $messagesResponse = $threads->messages()->list($runResponse->threadId);
        $response = collect($messagesResponse->data)->first(fn ($message) => $message->role === 'assistant')->content[0]->text->value;

        return json_decode($response, true) ?? $response;
    }
}

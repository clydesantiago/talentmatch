<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\PdfToText\Pdf;
use App\Models\Talent;
use App\Helper\Helper;

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
        $talent = Talent::findOrfail(11);
        $resume = public_path($talent->resume);
        $extractedText = Pdf::getText($resume);
        $result = Helper::runAssistant('asst_zjmUA8lBae3IBt0pvc5qFSYa', $extractedText);

        dd($result);
    }
}

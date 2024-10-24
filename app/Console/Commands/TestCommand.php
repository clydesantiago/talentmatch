<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
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
        // $result = Helper::runAssistant('asst_zrCOGFokVBWYixfme8fPLxWP', '{ project_title: "Inventory system", project_description: "Inventory system for an e-commerce website", role: "Web developer" }');
        $result = Helper::runAssistant('asst_zHzzmHIaziZfzsIWNFvHzHBn', '{ project_title: "Inventory system", project_description: "Inventory system for an e-commerce website" }');
        dd($result);
    }
}

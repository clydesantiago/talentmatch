<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobListRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'job_name' => 'nullable|string',
            'job_description' => 'nullable|string',
            'job_role' => 'nullable|array',
        ];
    }
}

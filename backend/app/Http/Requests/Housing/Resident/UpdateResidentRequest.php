<?php

namespace App\Http\Requests\Housing\Resident;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\JsonResponse;

class UpdateResidentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'file'],
            'marital_status' => ['nullable', 'string', 'max:50'],
            'occupant_status' => ['nullable', 'string', 'max:50'],
            'mobile_number' => ['nullable', 'string', 'max:25'],
        ];
    }

    protected function failedValidation(Validator $validator): JsonResponse
    {
        return response()->json([
            'message' => 'validation error',
            'errors' => $validator->errors()->messages(),
        ], 422);
    }
}

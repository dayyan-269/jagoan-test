<?php

namespace App\Http\Requests\Finance\Spending;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\JsonResponse;

class UpdateSpendingRequest extends FormRequest
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
            'spending_type_id' => ['required', 'numeric', 'exists:spending_types,id'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
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

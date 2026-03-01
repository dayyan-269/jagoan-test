<?php

namespace App\Http\Requests\Housing\HousePayment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\JsonResponse;

class StoreHousePaymentRequest extends FormRequest
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
            'resident_id' => ['required', 'numeric', 'exists:residents,id'],
            'payment_date' => ['required', 'date'],
            'payment_amount' => ['required', 'numeric', 'min:0'],
            'payment_status' => ['required', 'boolean'],
            'description' => ['nullable', 'string'],
            'month_amount' => ['required', 'numeric', 'min:1'],
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

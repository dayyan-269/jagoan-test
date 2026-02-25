<?php

namespace App\housing;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Resident extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'photo',
        'marital_status',
        'occupant_status',
        'mobile_number',
    ];

    protected function photo(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? Storage::url($value) : null,
        );
    }
}

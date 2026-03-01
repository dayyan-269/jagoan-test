<?php

namespace App\finance;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SpendingType extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'amount',
    ];

    protected $casts = [
        'amount' => 'integer',
    ];
}

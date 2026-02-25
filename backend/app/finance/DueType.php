<?php

namespace App\finance;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DueType extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'amount',
    ];
}

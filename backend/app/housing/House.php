<?php

namespace App\housing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class House extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'number',
        'status',
    ];

    public function occupantHistory(): HasMany
    {
        return $this->hasMany(OccupantHistory::class, 'house_id', 'id');
    }

    public function housePayment(): HasMany
    {
        return $this->hasMany(HousePayment::class, 'house_id', 'id');
    }
}

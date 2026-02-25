<?php

namespace App\housing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OccupantHistory extends Model
{
    protected $fillable = [
        'house_id',
        'resident_id',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date:d F Y',
        'end_date' => 'date:d F Y',
    ];

    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class, 'house_id', 'id');
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class, 'resident_id', 'id');
    }

    public function housePayment(): HasMany
    {
        return $this->hasMany(HousePayment::class, 'occupant_history_id', 'id');
    }
}

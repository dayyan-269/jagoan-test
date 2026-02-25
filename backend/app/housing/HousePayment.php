<?php

namespace App\housing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HousePayment extends Model
{
    protected $fillable = [
        'occupant_history_id',
        'payment_date',
        'payment_amount',
        'payment_status',
        'description',
    ];

    public function occupantHistory(): BelongsTo
    {
        return $this->belongsTo(OccupantHistory::class, 'occupant_history_id', 'id');
    }
}

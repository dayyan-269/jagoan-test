<?php

namespace App\finance;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Spending extends Model
{
    protected $fillable = [
        'spending_type_id',
        'date',
        'description',
    ];

    protected $casts = [
        'date' => 'date:j F Y',
    ];

    public function spendingType(): BelongsTo
    {
        return $this->belongsTo(SpendingType::class, 'spending_type_id', 'id');
    }
}

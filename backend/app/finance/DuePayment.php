<?php

namespace App\finance;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\finance\DueType;
use App\housing\Resident;

class DuePayment extends Model
{
    protected $fillable = [
        'due_type_id',
        'resident_id',
        'date',
        'description',
    ];

    protected $casts = [
        'date' => 'date:j F Y',
    ];

    public function dueType(): BelongsTo
    {
        return $this->belongsTo(DueType::class, 'due_type_id', 'id');
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class, 'resident_id', 'id');
    }
}

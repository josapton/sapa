<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_code',
        'user_id',
        'category_id',
        'type',
        'visibility',
        'title',
        'content',
        'incident_date',
        'incident_location',
        'status',
        'assigned_to'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->where('type', 'internal');
    }

    public function publicComments()
    {
        return $this->hasMany(Comment::class)->where('type', 'public');
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_submissions')->withTimestamps();
    }
}

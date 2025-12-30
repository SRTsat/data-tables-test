<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    /**
     * fillable digunakan untuk menentukan kolom mana saja 
     * yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = ['name']; 
}
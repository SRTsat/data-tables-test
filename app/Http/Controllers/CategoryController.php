<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('CategoryList', [
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required']);
        Category::create($request->all());
        return back();
    }

    public function destroy($id)
    {
        Category::findOrFail($id)->delete();
        return back();
    }
}
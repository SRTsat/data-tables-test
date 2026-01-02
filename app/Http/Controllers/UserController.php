<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('UserList', [
            'categories' => Category::all()
        ]);
    }

    public function getData(Request $request)
    {
        // 1. Ambil Query Dasar
        $query = User::with('category')->select('users.*');

        // 2. Filter Manual sebelum masuk ke DataTables::of
        if ($request->filled('categories')) {
            $categoryList = explode(',', $request->categories);
            $query->whereHas('category', function ($q) use ($categoryList) {
                $q->whereIn('name', $categoryList);
            });
        }

        // 3. Masukkan ke Yajra
        return DataTables::of($query)
            ->addIndexColumn()
            ->make(true);
    }

    public function destroy($id)
    {
        $user = \App\Models\User::find($id);

        if (!$user) {
            return back()->with('error', 'User tidak ditemukan');
        }

        $user->delete();
        return back();
    }

    public function bulkDelete(Request $request)
    {

        $ids = $request->ids;
        if (!empty($ids)) {
            DB::table('users')->whereIn('id', $ids)->delete();
        }

        return back();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'nullable',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        \App\Models\User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'category_id' => $data['category_id'],
            'password' => bcrypt('password123'),
        ]);

        return back();
    }

    public function create()
    {
        return Inertia::render('UserCreate');
    }

    public function edit($id)
    {
        $user = \App\Models\User::findOrFail($id);
        return Inertia::render('UserEdit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = \App\Models\User::findOrFail($id);

        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $user->update($data);

        return back();
    }
}

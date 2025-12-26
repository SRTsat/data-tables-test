<?php

namespace App\Http\Controllers;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        // Mengambil semua data user dari database
        return Inertia::render('UserList', [
            'users' => User::all() 
        ]);
    }

    public function destroy($id)
    {
        $user = \App\Models\User::find($id);
    
        if (!$user) {
        // Ini buat jaga-jaga kalau datanya emang gak ada
        return back()->with('error', 'User tidak ditemukan');
    }

        $user->delete();
        return back(); // Inertia akan refresh data secara otomatis
    }

public function bulkDelete(Request $request)
{
    // Cek manual: kalau ini muncul di layar, berarti data masuk
    // return response()->json($request->all()); 

    $ids = $request->ids; // atau $request->input('ids')

    if (!empty($ids)) {
        // Pakai query builder langsung biar lebih kuat
        DB::table('users')->whereIn('id', $ids)->delete();
    }

    return back(); 
}
}

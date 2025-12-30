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
        return Inertia::render('UserList', [
            'users' => User::all()
        ]);
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
            'password' => 'nullable'
        ]);

        \App\Models\User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt('password123'),
        ]);

        return redirect()->route('users.index')->with('message', 'User berhasil dibuat!');
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
            // Validasi email agar unik kecuali untuk email user ini sendiri
            'email' => 'required|email|unique:users,email,' . $id,
        ]);

        $user->update($data);

        return redirect()->route('users.index')->with('success', 'Data berhasil diupdate!');
    }
}

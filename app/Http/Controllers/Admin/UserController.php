<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;  // ← ADD THIS LINE
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        Gate::authorize('manage-users');

        $users = User::with('role')
            ->latest()
            ->paginate(15);

        $roles = Role::all();

        return view('admin.users.index', compact('users', 'roles'));
    }

    public function create()
    {
        Gate::authorize('manage-users');

        $roles = Role::whereIn('slug', [Role::MEMBER, Role::PREMIUM])->get();

        return view('admin.users.create', compact('roles'));
    }

    public function store(Request $request)
    {
        Gate::authorize('manage-users');

        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role_id'  => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($data['role_id']);

        // Only allow creating Member or Premium accounts here
        if (! in_array($role->slug, [Role::MEMBER, Role::PREMIUM], true)) {
            return back()->withErrors(['role_id' => 'You can only register Member or Premium accounts.']);
        }

        $borrowLimit = $role->slug === Role::PREMIUM ? 10 : 3;

        User::create([
            'name'         => $data['name'],
            'email'        => $data['email'],
            'password'     => Hash::make($data['password']),
            'role_id'      => $role->id,
            'borrow_limit' => $borrowLimit,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', "User '{$data['name']}' registered as {$role->name}.");
    }

    public function updateRole(Request $request, User $user)
    {
        Gate::authorize('manage-users');

        $data = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($data['role_id']);

        // Never allow promoting/demoting someone to or from Admin via this control
        if ($role->slug === Role::ADMIN || $user->isAdmin()) {
            return back()->with('error', 'Admin role cannot be assigned or changed here.');
        }

        $user->update([
            'role_id'      => $role->id,
            'borrow_limit' => $role->slug === Role::PREMIUM ? 10 : 3,
        ]);

        return back()->with('success', "{$user->name} is now {$role->name}.");
    }

    public function updatePassword(Request $request, User $user)
    {
        Gate::authorize('manage-users');

        $data = $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $user->update([
            'password' => Hash::make($data['password']),
        ]);

        return back()->with('success', "Password updated for {$user->name}.");
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete-user');

        // Prevent admin from deleting themselves
        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        // Prevent deleting other admins
        if ($user->isAdmin()) {
            return back()->with('error', 'Admin accounts cannot be deleted.');
        }

        $user->delete(); // soft delete (uses SoftDeletes trait on User model)

        return redirect()->route('admin.users.index')
            ->with('success', "User '{$user->name}' has been deleted.");
    }
}
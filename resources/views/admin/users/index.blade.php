@extends('layouts.app')
@section('title', 'Manage Users — BiblioVerse')

@section('content')

<div class="flex items-center justify-between mb-8">
    <div>
        <h1 class="text-2xl font-bold mb-1">Manage Users</h1>
        <p class="text-slate-400">Promote members, reset passwords, register new accounts.</p>
    </div>
    <a href="{{ route('admin.users.create') }}"
       class="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition">
        + Register User
    </a>
</div>

<div class="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
    <table class="w-full text-sm">
        <thead class="bg-white/5 text-slate-400 text-left">
            <tr>
                <th class="px-5 py-3">Name</th>
                <th class="px-5 py-3">Email</th>
                <th class="px-5 py-3">Role</th>
                <th class="px-5 py-3">Borrow Limit</th>
                <th class="px-5 py-3">Change Role</th>
                <th class="px-5 py-3">Reset Password</th>
                <th class="px-5 py-3">Actions</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
            @foreach($users as $user)
            <tr>
                <td class="px-5 py-3 text-slate-100">{{ $user->name }}</td>
                <td class="px-5 py-3 text-slate-400">{{ $user->email }}</td>
                <td class="px-5 py-3">
                    <span class="text-xs px-2 py-1 rounded-full bg-violet-500/15 border border-violet-400/30 text-violet-300">
                        {{ $user->role->name }}
                    </span>
                </td>
                <td class="px-5 py-3 text-slate-400">{{ $user->borrow_limit }}</td>
                <td class="px-5 py-3">
                    @if($user->isAdmin())
                        <span class="text-xs text-slate-500">—</span>
                    @else
                        <form action="{{ route('admin.users.role', $user) }}" method="POST" class="flex items-center gap-2">
                            @csrf
                            @method('PATCH')
                            <select name="role_id" class="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs">
                                @foreach($roles->whereIn('slug', ['member', 'premium']) as $role)
                                    <option value="{{ $role->id }}" {{ $user->role_id == $role->id ? 'selected' : '' }}>
                                        {{ $role->name }}
                                    </option>
                                @endforeach
                            </select>
                            <button type="submit" class="text-xs px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-400/30 text-violet-300 hover:bg-violet-500/30 transition">
                                Update
                            </button>
                        </form>
                    @endif
                </td>
                <td class="px-5 py-3">
                    <form action="{{ route('admin.users.password', $user) }}" method="POST" class="flex items-center gap-2">
                        @csrf
                        @method('PATCH')
                        <input type="password" name="password" placeholder="New password" required minlength="6"
                               class="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs w-32">
                        <button type="submit" class="text-xs px-3 py-1.5 rounded-lg bg-pink-500/20 border border-pink-400/30 text-pink-300 hover:bg-pink-500/30 transition">
                            Reset
                        </button>
                    </form>
                </td>
                <td class="px-5 py-3">
                    @if(!$user->isAdmin() && $user->id !== auth()->id())
                        <form action="{{ route('admin.users.destroy', $user) }}" method="POST"
                              onsubmit="return confirm('Are you sure you want to delete {{ $user->name }}? This action cannot be undone.')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30 transition">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </form>
                    @else
                        <span class="text-xs text-slate-500">—</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<div class="mt-6">
    {{ $users->links() }}
</div>

@endsection
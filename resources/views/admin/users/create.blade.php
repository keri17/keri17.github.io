@extends('layouts.app')
@section('title', 'Register User — BiblioVerse')

@section('content')

<h1 class="text-2xl font-bold mb-8">Register New User</h1>

<form action="{{ route('admin.users.store') }}" method="POST" class="max-w-md space-y-5">
    @csrf

    <div>
        <label class="block text-sm text-slate-400 mb-1.5">Name</label>
        <input type="text" name="name" value="{{ old('name') }}" required
               class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
    </div>

    <div>
        <label class="block text-sm text-slate-400 mb-1.5">Email</label>
        <input type="email" name="email" value="{{ old('email') }}" required
               class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
    </div>

    <div>
        <label class="block text-sm text-slate-400 mb-1.5">Password</label>
        <input type="password" name="password" required minlength="6"
               class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
    </div>

    <div>
        <label class="block text-sm text-slate-400 mb-1.5">Role</label>
        <select name="role_id" required
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:border-violet-400/50 focus:outline-none">
            <option value="">Select role</option>
            @foreach($roles as $role)
                <option value="{{ $role->id }}" {{ old('role_id') == $role->id ? 'selected' : '' }}>
                    {{ $role->name }}
                </option>
            @endforeach
        </select>
    </div>

    <div class="flex gap-3 pt-2">
        <button type="submit"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium hover:opacity-90 transition">
            Register User
        </button>
        <a href="{{ route('admin.users.index') }}" class="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition">
            Cancel
        </a>
    </div>
</form>

@endsection
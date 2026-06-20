<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Library-MS')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-body bg-slate-950 text-slate-100 min-h-screen antialiased">

    {{-- Background ambient glow --}}
    <div class="fixed inset-0 -z-10 overflow-hidden">
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
        <div class="absolute top-1/3 -right-40 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
    </div>

    {{-- Navbar --}}
    <nav class="relative z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="{{ route('dashboard') }}" class="flex items-center gap-2">
                <span class="text-xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    Library-MS
                </span>
            </a>

            @auth
            <div class="flex items-center gap-6 text-sm">
                <a href="{{ route('dashboard') }}"
                   class="text-slate-300 hover:text-white transition {{ request()->routeIs('dashboard') ? 'text-white font-semibold' : '' }}">
                    Dashboard
                </a>
                <a href="{{ route('books.index') }}"
                   class="text-slate-300 hover:text-white transition {{ request()->routeIs('books.index') ? 'text-white font-semibold' : '' }}">
                    Books
                </a>
                @if(auth()->user()->isPremium() || auth()->user()->isAdmin())
                <a href="{{ route('premium.catalog') }}"
                   class="text-slate-300 hover:text-white transition {{ request()->routeIs('premium.catalog') ? 'text-white font-semibold' : '' }}">
                    Premium
                </a>
                @endif
                <a href="{{ route('borrowings.mine') }}"
                   class="text-slate-300 hover:text-white transition {{ request()->routeIs('borrowings.mine') ? 'text-white font-semibold' : '' }}">
                    My Borrowings
                </a>
                @if(auth()->user()->isAdmin())
                <a href="{{ route('admin.borrowings.index') }}"
                   class="text-slate-300 hover:text-white transition {{ request()->routeIs('admin.borrowings.index') ? 'text-white font-semibold' : '' }}">
                    All Borrowings
                </a>
                <a href="{{ route('admin.users.index') }}"
   class="text-slate-300 hover:text-white transition {{ request()->routeIs('admin.users.*') ? 'text-white font-semibold' : '' }}">
    Users
</a>
                <a href="{{ route('admin.books.create') }}"
                   class="text-slate-300 hover:text-white transition {{ request()->routeIs('admin.books.*') ? 'text-white font-semibold' : '' }}">
                    Manage Books
                </a>
                @endif

                <div class="flex items-center gap-3 pl-4 border-l border-white/10">
                    <img src="{{ auth()->user()->avatar }}" alt="" class="w-8 h-8 rounded-full ring-2 ring-violet-500/40">
                    <span class="text-slate-300">{{ auth()->user()->name }}</span>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button class="text-slate-400 hover:text-pink-400 transition text-sm">Logout</button>
                    </form>
                </div>
            </div>
            @endauth
        </div>
    </nav>

    {{-- Flash messages --}}
    <div class="relative z-20 max-w-7xl mx-auto px-6 pt-6">
        @if(session('success'))
        <div class="mb-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
            {{ session('success') }}
        </div>
        @endif
        @if(session('error'))
        <div class="mb-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {{ session('error') }}
        </div>
        @endif
        @if($errors->any())
        <div class="mb-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            <ul class="list-disc list-inside space-y-1">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif
    </div>

    {{-- Page content --}}
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-8">
        @yield('content')
    </main>

</body>
</html>
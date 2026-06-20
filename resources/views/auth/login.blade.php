<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library-MS — Sign In</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-body antialiased bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden relative">

    {{-- Animated gradient mesh background --}}
    <div class="fixed inset-0 bg-mesh bg-[length:200%_200%] animate-gradient-x"></div>
    <div class="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-950/95 to-slate-950"></div>

    {{-- Floating decorative orbs --}}
    <div class="fixed top-10 left-10 w-72 h-72 bg-violet-600/30 rounded-full blur-3xl animate-float"></div>
    <div class="fixed bottom-10 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-float" style="animation-delay: -3s;"></div>
    <div class="fixed top-1/2 left-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-float" style="animation-delay: -1.5s;"></div>

    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">

        {{-- Brand --}}
        <div class="mb-10 text-center animate-fade-up">
            <h1 class="font-display text-4xl font-bold tracking-tight">
                <span class="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">Library-MS</span>
            </h1>
        </div>

        {{-- Success message --}}
        @if (session('success'))
            <div class="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm animate-fade-up max-w-sm w-full">
                {{ session('success') }}
            </div>
        @endif

        {{-- Error message --}}
        @if ($errors->any())
            <div class="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm animate-fade-up max-w-sm w-full">
                {{ $errors->first() }}
            </div>
        @endif

        {{-- LOGIN FORM --}}
        <form action="{{ route('login.submit') }}" method="POST" class="w-full max-w-sm animate-fade-up">
            @csrf
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value="{{ old('email') }}"
                        placeholder="you@library.dev"
                        required
                        autofocus
                        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400/50 transition-all"
                    >
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400/50 transition-all"
                    >
                </div>

                <label class="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" name="remember" class="rounded border-slate-600 bg-white/5 text-violet-500 focus:ring-violet-500/50">
                    <span class="text-sm text-slate-400">Remember me</span>
                </label>

                <button
                    type="submit"
                    class="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 hover:from-violet-500 hover:via-pink-500 hover:to-orange-400 text-white font-semibold shadow-xl shadow-violet-500/30 transition-all duration-300 hover:shadow-violet-500/50 hover:-translate-y-0.5"
                >
                    Sign In
                </button>
            </div>
        </form>

    </div>

</body>
</html>
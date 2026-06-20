<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowingController;

Route::get('/', fn() => redirect()->route('login'));

// ── Auth ───────────────────────────────────────────────────────────────────────
Route::get('/login',              [LoginController::class, 'showLogin'])->name('login');
Route::post('/login',             [LoginController::class, 'login'])->name('login.submit');
Route::post('/demo-login/{role}', [LoginController::class, 'demoLogin'])->name('demo.login');
Route::post('/logout',            [LoginController::class, 'logout'])->name('logout')->middleware('auth');

// ── Authenticated ──────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Books (all authenticated users) ───────────────────────────────────────
    Route::get('/books',        [BookController::class, 'index'])->name('books.index');
    Route::get('/books/{book}', [BookController::class, 'show'])->name('books.show');

    // ── Premium catalog (premium + admin via Gate inside controller) ───────────
    Route::get('/premium/catalog', [BookController::class, 'premiumCatalog'])->name('premium.catalog');

    // ── Borrowing actions ──────────────────────────────────────────────────────
    Route::post('/books/{book}/borrow',           [BorrowingController::class, 'borrowBook'])->name('books.borrow');
    Route::post('/borrowings/{borrowing}/return',  [BorrowingController::class, 'returnBook'])->name('borrowings.return');
    Route::get('/my-borrowings',                  [BorrowingController::class, 'myBorrowings'])->name('borrowings.mine');

    // ── Admin ──────────────────────────────────────────────────────────────────
   Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/borrowings', [BorrowingController::class, 'allBorrowings'])->name('borrowings.index');
    Route::resource('/books', BookController::class)->except(['index', 'show']);

    // Users
    Route::get('/users',                    [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/create',             [\App\Http\Controllers\Admin\UserController::class, 'create'])->name('users.create');
    Route::post('/users',                   [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}/role',      [\App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('users.role');
    Route::patch('/users/{user}/password',  [\App\Http\Controllers\Admin\UserController::class, 'updatePassword'])->name('users.password');
     Route::delete('/users/{user}',         [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
});
});
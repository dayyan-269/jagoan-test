<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = Auth::attempt([
            'email' => $request->email,
            'password' => $request->password,
        ]);

        return response()->json([
            'message' => 'request success',
            'data' => [
                'user' => Auth::user(),
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
            ]
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $token = Auth::attempt($credentials);

            if ($token) {
                return response()->json([
                    'message' => 'request success',
                    'data' => [
                        'user' => Auth::user(),
                        'token' => $token,
                    ],
                ], 201);
            } else {
                return response()->json([
                    'error' => 'Invalid credentials'
                ], 401);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Could not create token',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function refresh(): JsonResponse
    {
        return response()->json([
            'message' => 'request success',
            'data' => [
                'token' => Auth::refresh(),
            ]
        ]);
    }

    public function me(): JsonResponse
    {
        return response()->json([
            'message' => 'request success',
            'data' => [
                'user' => Auth::user()
            ]
        ]);
    }
}

import { apiClient } from "@/lib/api/client"
import {
  ForgotPasswordRequest,
  LogInUserRequest,
  LogOutUserRequest,
  RefreshAccessTokenRequest,
  RegisterUserRequest,
} from "@/lib/api/types/auth"

export async function register(body: RegisterUserRequest) {
  const { data, error } = await apiClient.POST("/api/v1/users/register", {
    body,
  })
  if (error) throw error
  return data
}

export async function login(body: LogInUserRequest) {
  const { data, error } = await apiClient.POST("/api/v1/users/login", { body })
  if (error) throw error
  return data
}

export async function refreshAccessToken(body: RefreshAccessTokenRequest) {
  const { data, error } = await apiClient.POST("/api/v1/users/refresh-token", {
    body,
  })
  if (error) throw error
  return data
}

export async function logout(body: LogOutUserRequest) {
  const { error } = await apiClient.POST("/api/v1/users/logout", {
    body,
  })

  if (error) throw error
}

export async function forgotPassword(body: ForgotPasswordRequest) {
  const { error } = await apiClient.POST("/api/v1/users/forgot-password", {
    body,
  })
  if (error) throw error
}

/*
type RegisterUserRequest = {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    password?: string | null;
}

type LogInUserRequest = {
    email?: string | null;
    password?: string | null;
}

type LogOutUserRequest = {
  refreshToken?: string | null;
}

type RefreshAccessTokenRequest = {
    refreshToken?: string | null;
}

type ForgotPasswordRequest = {
    email?: string | null;
}

// Responses

type RegisterUserResponse = string // new user id (uuid)

type LogInUserResponse = AccessTokenResponse
type RefreshAccessTokenResponse = AccessTokenResponse
type AccessTokenResponse = {
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresInSeconds?: number; // int32
}

type LogoutResponse = void // 204 No Content
type ForgotPasswordResponse = void // 204 No Content
*/

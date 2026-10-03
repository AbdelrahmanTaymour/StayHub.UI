import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import {
  UpdateUserNameRequest,
  UpdateUserProfileRequest,
} from "@/lib/api/types/users"

export async function getLoggedInUser() {
  const { data, error } = await apiClient.GET("/api/v1/users/me")
  if (error) throw error
  return data
}

export async function getUser(id: string) {
  const { data, error } = await apiClient.GET("/api/v1/users/{id}", {
    params: { path: { id } },
  })
  if (error) throw error
  return data
}

export async function getOwnerProfile(ownerId: string) {
  const { data, error } = await apiClient.GET(
    "/api/v1/users/{ownerId}/profile",
    {
      params: { path: { ownerId } },
    }
  )
  if (error) throw error
  return data
}

export async function updateUserName(id: string, body: UpdateUserNameRequest) {
  const { error } = await apiClient.PUT("/api/v1/users/{id}/name", {
    params: { path: { id } },
    body,
  })
  if (error) throw error
}

export async function updateUserProfile(
  id: string,
  body: UpdateUserProfileRequest
) {
  const { error } = await apiClient.PUT("/api/v1/users/{id}/profile", {
    params: { path: { id } },
    body,
  })
  if (error) throw error
}

/*
type UpdateUserNameRequest = {
    firstName?: string | null;
    lastName?: string | null;
}

type UpdateUserProfileRequest = {
    avatarUrl?: string | null;
    bio?: string | null;
    phoneNumber?: string | null;
}

// Responses

type GetLoggedInUserResponse = LoggedInUserResponse
type LoggedInUserResponse = {
    id?: string; // uuid
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    role?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    phoneNumber?: string | null;
}

type GetUserResponse = UserResponse
type UserResponse = {
    id?: string; // uuid
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    phoneNumber?: string | null;
}

type GetOwnerProfileResponse = UserProfileResponse
type UserProfileResponse = {
    id?: string; // uuid
    fullName?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    rating?: number | null; // double
    reviewCount?: number; // int32
    activeListingsCount?: number; // int32
}

type UpdateUserNameResponse = void // 204 No Content
type UpdateUserProfileResponse = void // 204 No Content
*/

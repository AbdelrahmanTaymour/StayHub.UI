import { unwrap } from "@/lib/errors/api-error"
import { apiClientBrowser as apiClient } from "@/lib/api/client-browser"
import {
  UpdateUserNameRequest,
  UpdateUserProfileRequest,
} from "@/lib/api/types/users"

export async function getLoggedInUser() {
  return unwrap(await apiClient.GET("/api/v1/users/me"))
}

export async function getUser(id: string) {
  return unwrap(
    await apiClient.GET("/api/v1/users/{id}", {
      params: { path: { id } },
    })
  )
}

export async function getOwnerProfile(ownerId: string) {
  return unwrap(
    await apiClient.GET("/api/v1/users/{ownerId}/profile", {
      params: { path: { ownerId } },
    })
  )
}

export async function updateUserName(body: UpdateUserNameRequest) {
  return unwrap(
    await apiClient.PUT("/api/v1/users/profile/name", {
      body,
    })
  )
}

export async function updateUserProfile(body: UpdateUserProfileRequest) {
  return unwrap(
    await apiClient.PUT("/api/v1/users/profile", {
      body,
    })
  )
}

export async function updateProfileAvatar(file: File) {
  return unwrap(
    await apiClient.PUT("/api/v1/users/profile/avatar", {
      body: {
        file: file as unknown as string,
      },

      bodySerializer(body) {
        const fd = new FormData()

        Object.entries(body as Record<string, unknown>).forEach(
          ([key, value]) => {
            if (value !== undefined && value !== null) {
              fd.append(key, value as never)
            }
          }
        )

        return fd
      },
    })
  )
}

/*
type UpdateUserNameRequest = {
    firstName?: string | null;
    lastName?: string | null;
}

type UpdateUserProfileRequest = {
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

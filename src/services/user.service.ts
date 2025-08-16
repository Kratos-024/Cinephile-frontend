import type { WatchlistResponse } from "../components/UserProfileHero";
import type { ApiUserProfile } from "../components/Users";

 
const API_BASE_URL = "http://localhost:8000";

export interface SelectedMovie {
  title: string;
}

export interface UserPreference {
  userId: string;
  preferences: SelectedMovie[];
  timestamp: string;
  totalPreferences: number;
  updatedAt: any;
}

export interface UserReview {
  id: string;
  userId: string;
  imdbid: number;
  title: string;
  review: string;
  rating?: number;
  timestamp: string;
  updatedAt: any;
}

export interface UserProfile {
  bio?: string;
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  followers?: string[];
  following?: string[];
  followersCount?: number;
  followingCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

type Timestamp = {
  _seconds: number;
  _nanoseconds: number;
};

type Profile = {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
};

type CountWithProfiles = {
  count: number;
  profiles: Profile[];
};

type Stats = {
  followersCount: number;
  followingCount: number;
  totalReviews: number;
  totalWatchlistItems: number;
};
export interface MovieCommentResponse {
  movieTitle: string;
  poster: string;
  imdb_id: string;
  id?: string;
  rating: number;
  userDisplayName: string;
  comment: string;
  title: string;
  userId?: string;
  userPhotoURL: string;
  timestamp?: string;
  updatedAt?: Timestamp;
}
export type UserData = {
  data: {
    followers: CountWithProfiles;
    following: CountWithProfiles;
    profile: Profile;
    reviews: MovieCommentResponse[];
    stats: Stats;
    watchlist: any[];
  };
  success: boolean;
};

export interface UserProfileResponse {
  success: boolean;
  data: {
    userId: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    joinedDate: Timestamp;
    photoURL: string;
    updatedAt: Timestamp;
  };
}

export interface UserFollowData {
  followers?: UserProfile[];
  following?: UserProfile[];
  followersCount: number;
  followingCount: number;
}

// API Response Interfaces
export interface UserApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  status?: number;
  type?: string;
}

export interface UserPreferenceApiResponse extends UserApiResponse {
  data?: UserPreference;
}

export interface UserReviewsApiResponse extends UserApiResponse {
  data?: UserReview[];
  total?: number;
}

export interface UserProfileApiResponse extends UserApiResponse {
  data?: UserProfile;
}

export interface UserFollowApiResponse extends UserApiResponse {
  data?: UserFollowData;
}

export interface AuthResponse extends UserApiResponse {
  data?: {
    uid: string;
    email: string;
    displayName?: string;
    customToken?: string;
    photoURL?: string;
    followersCount?: number;
    followingCount?: number;
  };
}

export interface MovieApiReview {
  id: string;
  imdb_id: string;
  title: string;
  comment: string;
  rating: number;
  userDisplayName: string;
  userId: string;
  userPhotoURL: string;
  timestamp: string;
}

export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const authToken = token || localStorage.getItem("authToken");

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
};

const handleFetchResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentLength = response.headers.get("content-length");
  const contentType = response.headers.get("content-type");

  if (contentLength === "0") {
    throw new Error("Server returned empty response");
  }

  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.log("Non-JSON response:", text);
    throw new Error("Server returned non-JSON response");
  }
  const data = await response.json();

  return data;
};

const handleFetchError = (error: any, operation: string) => {

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      success: false,
      message: `Cannot connect to server. Please check if the backend is running on ${API_BASE_URL}`,
    };
  }

  if (error.name === "SyntaxError" && error.message.includes("JSON")) {
    return {
      success: false,
      message:
        "Server communication error. Please check if the backend is running.",
      code: "BACKEND_ERROR",
    };
  }

  return {
    success: false,
    message: error instanceof Error ? error.message : `${operation} failed`,
  };
};

const registerUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResponse> => {
  try {
    console.log("Registering user...");

    const response = await fetch(`${API_BASE_URL}/api/v1/user/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        email,
        password,
        displayName,
      }),
    });

    const data: AuthResponse = await handleFetchResponse(response);

    if (data.success && data.data?.customToken) {
      localStorage.setItem("authToken", data.data.customToken);
    }

    return data;
  } catch (error) {
    return handleFetchError(error, "registerUser") as AuthResponse;
  }
};

const loginUser = async (idToken: string): Promise<AuthResponse> => {
  try {
    console.log("Sending idToken to backend...");

    const response = await fetch(`${API_BASE_URL}/api/v1/user/login`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ idToken }),
    });

    const data: AuthResponse = await handleFetchResponse(response);

    if (data.success && idToken) {
      localStorage.setItem("authToken", idToken);
    }

    return data;
  } catch (error) {
    return handleFetchError(error, "loginUser") as AuthResponse;
  }
};

const resetPassword = async (email: string): Promise<UserApiResponse> => {
  try {
    console.log("Sending password reset request...");

    const response = await fetch(`${API_BASE_URL}/api/v1/user/reset-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });

    const data: UserApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    return handleFetchError(error, "resetPassword");
  }
};

const logoutUser = (): void => {
  console.log("Logging out user...");
  localStorage.removeItem("authToken");
};

const saveUserPreferences = async (
  preferences: { title: string; imdbID: string }[],
  token?: string
): Promise<UserPreferenceApiResponse> => {
  try {
    console.log("Saving user preferences...");

    const response = await fetch(`${API_BASE_URL}/api/v1/user/preferences`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ preferences }),
    });

    const data: UserPreferenceApiResponse = await handleFetchResponse(response);

    return data;
  } catch (error) {
    return handleFetchError(
      error,
      "saveUserPreferences"
    ) as UserPreferenceApiResponse;
  }
};
const isFollowingServiceHandler = async (
  token: string,
  targetUserId: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/user/isfollowing/${targetUserId}`,
      {
        method: "GET",
        headers: getAuthHeaders(token),
      }
    );

    const data = await handleFetchResponse(response);
    return data;
  } catch (error) {
    console.log(error);
    return handleFetchError(error, "isFollowingHandler");
  }
};

const getUserPreferences = async (
  userId?: string,
  token?: string
): Promise<UserPreferenceApiResponse> => {
  try {
    const url = userId
      ? `${API_BASE_URL}/api/v1/user/preferences/${userId}`
      : `${API_BASE_URL}/api/v1/user/preferences`;

    console.log("Getting user preferences from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data: UserPreferenceApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    return handleFetchError(
      error,
      "getUserPreferences"
    ) as UserPreferenceApiResponse;
  }
};

const updateUserPreferences = async (
  preferences: SelectedMovie[],
  token?: string
): Promise<UserPreferenceApiResponse> => {
  try {
    console.log("Updating user preferences...");

    const response = await fetch(`${API_BASE_URL}/api/v1/user/preferences`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ preferences }),
    });

    const data: UserPreferenceApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    return handleFetchError(
      error,
      "updateUserPreferences"
    ) as UserPreferenceApiResponse;
  }
};

const saveUserReview = async (
  tmdbId: number,
  title: string,
  review: string,
  rating?: number,
  token?: string
): Promise<UserApiResponse> => {
  try {
    console.log("Saving user review...");

    const response = await fetch(`${API_BASE_URL}/api/v1/user/reviews`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        tmdbId,
        title,
        review,
        rating,
      }),
    });

    const data: UserApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    return handleFetchError(error, "saveUserReview");
  }
};

const getUserReviewsHandler = async (
  userId: string,
  token: string
): Promise<any> => {
  try {
    const url = `https://cinephile-backend-1-gj4v.onrender.com/api/v1/user/reviews/${userId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MovieCommentResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error getting user reviews:", error);
    return {
      success: false,
      status: 500,
      message: "Something went wrong while getting user reviews",
      type: "INTERNAL_ERROR",
    };
  }
};

const deleteUserReview = async (
  reviewId: string,
  token?: string
): Promise<UserApiResponse> => {
  try {
    console.log("Deleting user review:", reviewId);

    const response = await fetch(
      `${API_BASE_URL}/api/v1/user/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(token),
      }
    );

    const data: UserApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    return handleFetchError(error, "deleteUserReview");
  }
};

const followUser = async (
  targetUserId: string,
  token?: string
): Promise<UserApiResponse> => {
  try {
    console.log("Following user:", targetUserId);

    const response = await fetch(`${API_BASE_URL}/api/v1/user/follow`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ targetUserId }),
    });

    const data: UserApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    return handleFetchError(error, "followUser");
  }
};

const unfollowUser = async (
  targetUserId: string,
  token?: string
): Promise<UserApiResponse> => {
  try {
    console.log("Unfollowing user:", targetUserId);

    const response = await fetch(`${API_BASE_URL}/api/v1/user/unfollow`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ targetUserId }),
    });

    const data: UserApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    return handleFetchError(error, "unfollowUser");
  }
};

const getUserFollowers = async (
  userId?: string,
  token?: string
): Promise<UserFollowApiResponse> => {
  try {
    const url = userId
      ? `${API_BASE_URL}/api/v1/user/followers/${userId}`
      : `${API_BASE_URL}/api/v1/user/followers`;

    console.log("Getting user followers from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data: UserFollowApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    const errorResponse = handleFetchError(error, "getUserFollowers");
    return {
      ...errorResponse,
      data: { followersCount: 0, followingCount: 0 },
    } as UserFollowApiResponse;
  }
};
// Types
interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
}

interface FollowingData {
  following: User[];
  followingCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}
const getUserFollowing = async (
  token?: string
): Promise<{
  data: FollowingData;
  message: string;
  success: boolean;
}> => {
  try {
    const url = `${API_BASE_URL}/api/v1/user/following`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data: {
      data: FollowingData;
      message: string;
      success: boolean;
    } = await handleFetchResponse(response);
    return data;
  } catch (error) {
    const errorResponse = handleFetchError(error, "getUserFollowing");
    return {
      ...errorResponse,
    } as {
      data: FollowingData;
      message: "";
      success: false;
    };
  }
};

const getUserProfile = async (
  userId: string,
  token: string
): Promise<UserProfileResponse | UserProfileApiResponse> => {
  try {
    const url = userId
      ? `${API_BASE_URL}/api/v1/user/profile/${userId}`
      : `${API_BASE_URL}/api/v1/user/profile`;

    const header = getAuthHeaders(token);
    console.log(header);
    const response = await fetch(url, {
      method: "GET",
      headers: header,
    });
    const data: UserProfileResponse = await handleFetchResponse(response);

    return data;
  } catch (error) {
    return handleFetchError(error, "getUserProfile") as UserProfileApiResponse;
  }
};

const addToWatchList = async (
  token: string,
  movieData: {
    imdbId: string;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: string;
  }
): Promise<UserProfileApiResponse> => {
  try {
    console.log("Adding to user profile watchlist:");
    const url = API_BASE_URL + "/api/v1/user/AddToWatchlist";
    const header = getAuthHeaders(token);
    console.log(header);

    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(movieData),
    });
    console.log(response);
    const data: UserProfileApiResponse = await handleFetchResponse(response);

    return data;
  } catch (error) {
    return handleFetchError(error, "getUserProfile") as UserProfileApiResponse;
  }
};

const getUserWatchlist = async (token: string, userId?: string): Promise<WatchlistResponse> => {
  try {
    const url = API_BASE_URL + `/api/v1/user/GetUserWatchlist/${userId}`;
    const header = getAuthHeaders(token);

    const response = await fetch(url, {
      method: "GET",
      headers: header,
    });
    const data: WatchlistResponse = await handleFetchResponse(response);

    return data;
  } catch (error) {
    return handleFetchError(error, "getUserProfile") as WatchlistResponse;
  }
};

const RemoveFromWatchlist = async (
  token: string,
  movieData: {
    imdbId: string;
  }
): Promise<UserProfileApiResponse> => {
  try {
    const url = API_BASE_URL + "/api/v1/user/RemoveFromWatchlist";

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(movieData),
    });

    const data: UserProfileApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    return handleFetchError(error, "getUserProfile") as UserProfileApiResponse;
  }
};
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

export interface GetTop10UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: ApiUserProfile[];
    totalUsers: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  message: string;
  type: string;
}

export const getTop10UsersHandler = async ({
  limit = 10,
  token,
}: {
  limit?: number;
  token?: string;
}): Promise<GetTop10UsersResponse | null> => {
  try {
    if (limit < 1 || limit > 50) {
      throw new Error("Limit must be between 1 and 50");
    }

    const url = new URL(`${API_BASE_URL}/api/v1/user/GetTop10Users`);
    url.searchParams.append("limit", limit.toString());

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.message || "Failed to fetch users");
    }

    const data: GetTop10UsersResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching top users:", error);
    return null;
  }
};

export {
  RemoveFromWatchlist,
  registerUser,
  loginUser,
  addToWatchList,
  resetPassword,
  logoutUser,
  saveUserPreferences,
  getUserPreferences,
  updateUserPreferences,
  saveUserReview,
  getUserReviewsHandler,
  deleteUserReview,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
  getUserProfile,
  isAuthenticated,
  getUserWatchlist,
  isFollowingServiceHandler,
};

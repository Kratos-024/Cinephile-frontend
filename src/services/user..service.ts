/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = "http://localhost:8000";

// Interfaces
export interface SelectedMovie {
  tmdbId: number;
  imdbId?: string;
  title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
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
  tmdbId: number;
  title: string;
  review: string;
  rating?: number;
  timestamp: string;
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  followers: string[];
  following: string[];
  followersCount: number;
  followingCount: number;
  createdAt: any;
  updatedAt: any;
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

const getAuthHeaders = (token?: string) => {
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
  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentLength = response.headers.get("content-length");
  const contentType = response.headers.get("content-type");

  console.log("Content-Length:", contentLength);
  console.log("Content-Type:", contentType);

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

// Helper function to handle fetch errors
const handleFetchError = (error: any, operation: string) => {
  console.error(`Error in ${operation}:`, error);

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

// Auth Services
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

// User Preference Services
const saveUserPreferences = async (
  preferences: SelectedMovie[],
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

// User Review Services
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

const getUserReviews = async (
  userId?: string,
  limit: number = 10,
  offset: number = 0,
  token?: string
): Promise<UserReviewsApiResponse> => {
  try {
    const url = userId
      ? `${API_BASE_URL}/api/v1/user/reviews/${userId}?limit=${limit}&offset=${offset}`
      : `${API_BASE_URL}/api/v1/user/reviews?limit=${limit}&offset=${offset}`;

    console.log("Getting user reviews from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data: UserReviewsApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    const errorResponse = handleFetchError(error, "getUserReviews");
    return {
      ...errorResponse,
      data: [],
      total: 0,
    } as UserReviewsApiResponse;
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

const getUserFollowing = async (
  userId?: string,
  token?: string
): Promise<UserFollowApiResponse> => {
  try {
    const url = userId
      ? `${API_BASE_URL}/api/v1/user/following/${userId}`
      : `${API_BASE_URL}/api/v1/user/following`;

    console.log("Getting user following from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data: UserFollowApiResponse = await handleFetchResponse(response);
    return data;
  } catch (error) {
    const errorResponse = handleFetchError(error, "getUserFollowing");
    return {
      ...errorResponse,
      data: { followersCount: 0, followingCount: 0 },
    } as UserFollowApiResponse;
  }
};

const getUserProfile = async (
  userId?: string,
  token?: string
): Promise<UserProfileApiResponse> => {
  try {
    const url = userId
      ? `${API_BASE_URL}/api/v1/user/profile/${userId}`
      : `${API_BASE_URL}/api/v1/user/profile`;

    console.log("Getting user profile from:", url);
    const header = getAuthHeaders(token);
    console.log(header);
    const response = await fetch(url, {
      method: "GET",
      headers: header,
    });

    const data: UserProfileApiResponse = await handleFetchResponse(response);
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

const RemoveFromWatchlist = async (
  token: string,
  movieData: {
    imdbId: string;
  }
): Promise<UserProfileApiResponse> => {
  try {
    console.log("Removing watchlist from user:");
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

const getCurrentUser = async (
  token?: string
): Promise<UserProfileApiResponse> => {
  console.log("Getting current user profile...");
  return getUserProfile(undefined, token);
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
  getUserReviews,
  deleteUserReview,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
  getUserProfile,
  isAuthenticated,
  getCurrentUser,
};

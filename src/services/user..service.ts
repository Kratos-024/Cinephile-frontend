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

// Helper function to get auth headers
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

// Auth Services
const registerUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        email,
        password,
        displayName,
      }),
    });

    const data: AuthResponse = await response.json();

    if (data.success && data.data?.customToken) {
      localStorage.setItem("authToken", data.data.customToken);
    }

    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    };
  }
};

const loginUser = async (idToken: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/login`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ idToken }),
    });

    const data: AuthResponse = await response.json();

    if (data.success && idToken) {
      localStorage.setItem("authToken", idToken);
    }

    return data;
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};

const resetPassword = async (email: string): Promise<UserApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/reset-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });

    const data: UserApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Password reset failed",
    };
  }
};

const logoutUser = (): void => {
  localStorage.removeItem("authToken");
};

// User Preference Services
const saveUserPreferences = async (
  preferences: SelectedMovie[],
  token?: string
): Promise<UserPreferenceApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/preferences`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ preferences }),
    });

    const data: UserPreferenceApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving user preferences:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to save preferences",
    };
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

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data: UserPreferenceApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get preferences",
    };
  }
};

const updateUserPreferences = async (
  preferences: SelectedMovie[],
  token?: string
): Promise<UserPreferenceApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/preferences`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ preferences }),
    });

    const data: UserPreferenceApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update preferences",
    };
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

    const data: UserApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving user review:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save review",
    };
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

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data: UserReviewsApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting user reviews:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get reviews",
      data: [],
      total: 0,
    };
  }
};

const deleteUserReview = async (
  reviewId: string,
  token?: string
): Promise<UserApiResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/user/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(token),
      }
    );

    const data: UserApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user review:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete review",
    };
  }
};

// User Social Services
const followUser = async (
  targetUserId: string,
  token?: string
): Promise<UserApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/follow`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ targetUserId }),
    });

    const data: UserApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error following user:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to follow user",
    };
  }
};

const unfollowUser = async (
  targetUserId: string,
  token?: string
): Promise<UserApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/unfollow`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ targetUserId }),
    });

    const data: UserApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to unfollow user",
    };
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

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data: UserFollowApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting user followers:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get followers",
      data: { followersCount: 0, followingCount: 0 },
    };
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

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data: UserFollowApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting user following:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get following",
      data: { followersCount: 0, followingCount: 0 },
    };
  }
};

// User Profile Services
const getUserProfile = async (
  userId?: string,
  token?: string
): Promise<UserProfileApiResponse> => {
  try {
    const url = userId
      ? `${API_BASE_URL}/api/v1/user/profile/${userId}`
      : `${API_BASE_URL}/api/v1/user/profile`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data: UserProfileApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get profile",
    };
  }
};

// Utility function to check if user is authenticated
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

// Utility function to get current user from token (you might need to decode JWT or call API)
const getCurrentUser = async (
  token?: string
): Promise<UserProfileApiResponse> => {
  return getUserProfile(undefined, token);
};

// Export all services
export {
  // Auth services
  registerUser,
  loginUser,
  resetPassword,
  logoutUser,

  // Preference services
  saveUserPreferences,
  getUserPreferences,
  updateUserPreferences,

  // Review services
  saveUserReview,
  getUserReviews,
  deleteUserReview,

  // Social services
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,

  // Profile services
  getUserProfile,

  // Utility functions
  isAuthenticated,
  getCurrentUser,
};

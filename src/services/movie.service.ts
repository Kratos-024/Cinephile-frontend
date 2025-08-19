 
import type { commentType } from "../components/CommentSection";
import type { MovieResponseCached } from "../components/ReccomendedByOurModel";
import { getAuthHeaders } from "./user.service";

interface MovieTitleApiResponse {
  success: boolean;
  data: {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  };
}
interface MovieTitlesApiResponse {
  success: boolean;
  data: {
    Response: string;
    totalResults: string;
    Search: {
      Title: string;
      Year: string;
      imdbID: string;
      Type: string;
      Poster: string;
    }[];
  };
}
export interface IMDBTrendingResponse {
  title: string;
  movieUrl: string;
  watchlistId: string;
  year: string;
  posterUrl: string;
  posterAlt: string;
  metascore: string;
  imdbVotes: string;
  imdbRating: string;
  rating: string;
  runtime: string;
  ranking: string;
  plot: string;
  director: string;
  stars: string[];
}

export interface MovieTrendingApiResponseData {
  page: number;
  results: IMDBTrendingResponse[];
  total_pages: number;
  total_results: number;
}

export interface MovieTrendingApiResponse {
  success: boolean;
  data: MovieTrendingApiResponseData;
  source?: string;
  cached_at?: string;
  expires_at?: string;
}
export interface CastMember {
  actorName: string;
  actorUrl: string;
  characterName: string;
  characterUrl: string;
  imageUrl: string;
  imageAlt: string;
  isVoiceRole: boolean;
}

export interface MovieImage {
  src: string;
  alt: string;
}

export interface MovieVideo {
  src: string;
  type: string;
  poster: string;
  className: string;
  id: string;
  preload: string;
  controls: boolean;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  width: number;
  height: number;
}

export interface MovieRatings {
  imdbScore: {
    rating: string;
    totalVotes: string;
    fullRating: string;
  };
  metascore: {
    score: string;
    backgroundColor: string;
  };
}
export interface MovieRating {
  Source: string;
  Value: string;
}

type MovieData = {
  url: string;
  scrapedAt: string;
  imdbId: string;
  title: string;
  storyline: string | null;
  ratings: {
    imdbScore: {
      rating: string;
      totalVotes: string;
      fullRating: string;
    };
    metascore: {
      score: string;
      backgroundColor: string;
    };
  };
  cast: {
    actorName: string;
    actorUrl: string;
    characterName: string;
    characterUrl: string;
    imageUrl: string;
    imageAlt: string;
    isVoiceRole: boolean;
  }[];
  videos: {
    title: string;
    videoUrl: string;
    imageUrl: string;
    imageAlt: string;
  }[];
  images: {
    src: string;
    alt: string;
  }[];
  videoSources: {
    src: string;
    type: string;
    poster: string;
    className: string;
    id: string;
    preload: string;
    controls: boolean;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    width: number;
    height: number;
  }[];
  poster: string;
  Country: string;
  Director: string;
  Released: string;
  Runtime: string;
  Awards: string;
  Language: string;
  storyLine: string;
  rating: {
    Source: string;
    Value: string;
  }[];
  genre: string;
  BoxOffice: string;
  Rated: string;
};

export interface MovieApiResponse {
  success: boolean;
  imdb_id: string;
  data: MovieData;
  source: string;
}

interface MovieApiErrorResponse {
  success: false;
  status: number;
  message: string;
  type?: string;
}

export type MovieResponse = MovieApiResponse | MovieApiErrorResponse;

export interface ApiMovieResponse {
  success: boolean;
  imdb_id: string;
  data: MovieData;
  source: string;
}

const getMovieByTitle = async (
  title: string
): Promise<MovieTitleApiResponse> => {
  try {
    if (!title || title.trim() === "") {
      throw new Error("Title parameter is required");
    }

    const encodedTitle = encodeURIComponent(title.trim());
    const url = `http://localhost:8000/api/v1/omdb/getMovieByTitle/${encodedTitle}`;
///
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MovieTitleApiResponse = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching movie by title:", error);

    return {
      success: false,
      data: {
        Title: "",
        Year: "",
        imdbID: "",
        Type: "",
        Poster: "",
      },
    };
  }
};
const getMoviesByTitle = async (
  title: string | undefined,
  page: number | undefined = 1
): Promise<MovieTitlesApiResponse> => {
  try {
    if (!title || title.trim() === "") {
      throw new Error("Title parameter is required");
    }

    const encodedTitle = encodeURIComponent(title.trim());
    const url = `http://localhost:8000/api/v1/omdb/getMoviesByTitle/${encodedTitle}?page=${page}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching movie by title:", error);
    throw error;
  }
};

const getTrendingMovies = async (): Promise<MovieTrendingApiResponse> => {
  try {
    const url = `http://localhost:8000/api/v1/tmdb/trending/movies`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MovieTrendingApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie by title:", error);

    return {
      success: false,
      data: {
        page: 0,
        results: [
          {
            title: "",
            movieUrl: "",
            watchlistId: "",
            year: "",
            posterUrl: "",
            posterAlt: "",
            metascore: "",
            imdbVotes: "",
            imdbRating: "",
            rating: "",
            runtime: "",
            ranking: "",
            plot: "",
            director: "",
            stars: [""],
          },
        ],
        total_pages: 0,
        total_results: 0,
      },
    };
  }
};

const getMovieData = async (
  imdbid: string
): Promise<ApiMovieResponse | MovieApiErrorResponse> => {
  try {
    const url = `http://localhost:8000/api/v1/tmdb/moviesdata/${imdbid}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiMovieResponse = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("Error fetching movie by title:", error);

    return {
      success: false,
      type: "Movie error",
      status: 400,
      message: "Something went wrong",
    };
  }
};
export interface CommentResponseType {
  success: boolean;
  message: string;
  data: {
    reviewId: string;
    userId: string;
    tmdbId: string;
    title: string;
  };
}
interface CommentErrorResponseType {
  success: false;
  status: number;
  message: string;
  type: string;
}
const deleteCommentHandler = async ({
  imdb_id,
  token,
}: {
  imdb_id: string;
  token: string;
}): Promise<CommentResponseType | CommentErrorResponseType> => {
  try {
    const url = `http://localhost:8000/api/v1/user/reviews/${imdb_id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CommentResponseType = await response.json();
    console.log(data);
    return data;
  } catch (error: any) {
    console.error("Error deleting review:", error);

    if (error) {
      return {
        success: false,
        status: error.statusCode,
        message: error.message,
        type: error.type,
      };
    } else {
      return {
        success: false,
        status: 500,
        message: "Something went wrong while deleting review",
        type: "INTERNAL_ERROR",
      };
    }
  }
};
const submitCommentHandler = async ({
  data: {
    imdb_id,
    title,
    comment,
    rating,
    userPhotoURL,
    userDisplayName,
    movieTitle,
    poster,
  },
  token,
}: {
  data: commentType;
  token: string;
}): Promise<CommentResponseType | CommentErrorResponseType> => {
  try {
    const url = `http://localhost:8000/api/v1/user/reviews/`;
    const commentData = {
      imdb_id,
      movieTitle,
      poster,
      title,
      comment,
      rating,
      userPhotoURL,
      userDisplayName,
    };
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(commentData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommentResponseType = await response.json();
    console.log(data);
    return data;
  } catch (error: any) {
    console.error("Error saving review:", error);

    if (error) {
      return {
        success: false,
        status: error.statusCode,
        message: error.message,
        type: error.type,
      };
    } else {
      return {
        success: false,
        status: 500,
        message: "Something went wrong while saving review",
        type: "INTERNAL_ERROR",
      };
    }
  }
};
const getMovieReviewsHandler = async ({
  imdb_id,
}: {
  imdb_id: string;
}): Promise<any> => {
  try {
    const url = `http://localhost:8000/api/v1/tmdb/moviesdata/reviews/${imdb_id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error getting movie reviews:", error);
    return {
      success: false,
      status: 500,
      message: "Something went wrong while getting movie reviews",
      type: "INTERNAL_ERROR",
    };
  }
};
interface CachedMoviesResponse {
  success: boolean;
  data: MovieResponseCached[];
  total: number;
  page?: number;
}

interface CachedMoviesErrorResponse {
  success: false;
  status: number;
  message: string;
  type: string;
}

const getCachedMoviesHandler = async ({
  limit = 10,
  page = 1,
  token,
}: {
  limit?: number;
  page?: number;
  token: string;
}): Promise<CachedMoviesResponse | CachedMoviesErrorResponse> => {
  try {
    const url = `http://localhost:8000/api/v1/omdb/cachedMovies?limit=${limit}&page=${page}`;
    const headers = getAuthHeaders(token);
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CachedMoviesResponse = await response.json();

    return data;
  } catch (error: any) {
    console.error("Error fetching cached movies:", error);

    return {
      success: false,
      status: 500,
      message: "Something went wrong while fetching cached movies",
      type: "INTERNAL_ERROR",
    };
  }
};
export interface SimilarMoviesResponse {
  message: string;
  similarMovies: {
    success: boolean;
    data: {
      Poster: string;
      Released: string;
      Title: string;
      Year: string;
      imdbID: string;
      imdbRating: string;
    };
    source: string;
    added_to_user: string;
  }[];
  similarMoviesCount: number;
  success: boolean;
}
const getSimilarMovies = async (
  title: string
): Promise<SimilarMoviesResponse> => {
  try {
    if (!title || title.trim() === "") {
      throw new Error("Title parameter is required");
    }

    const encodedTitle = encodeURIComponent(title.trim());
    const url = `http://localhost:8000/api/v1/tmdb/getSimilarMovies/${encodedTitle}`;
    const headers = getAuthHeaders();
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    console
    .log("fishfisdhodsfhsdkf",data)
    return data;
  } catch (error) {
    console.error("Error fetching movie by title:", error);
    throw error;
  }
};
export {
  getTrendingMovies,
  getMovieByTitle,
  getMovieData,
  submitCommentHandler,
  deleteCommentHandler,
  getMovieReviewsHandler,
  getMoviesByTitle,
  getCachedMoviesHandler,
  getSimilarMovies,
};

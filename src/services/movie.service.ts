/* eslint-disable @typescript-eslint/no-explicit-any */
import type { commentType } from "../components/CommentSection";
import { getAuthHeaders } from "./user..service";

interface MovieTitleResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface MovieTitleApiResponseData {
  Search: MovieTitleResult[];
  totalResults: string;
  Response: string;
}

interface MovieTitleApiResponse {
  success: boolean;
  data: MovieTitleApiResponseData;
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
interface MovieStoryline {
  tagline: string;
  story: string;
  genres: string[];
  keywords: string[];
}

interface MovieData {
  Awards: string;
  Director: string;
  Country: string;
  Rated: string;
  Runtime: string;
  Released: string;
  genre: string;
  cast: CastMember[];
  images: MovieImage[];
  ratings: MovieRatings;
  storyline: MovieStoryline;
  rating: MovieRating[];
  storyLine: string;
  videoSources: MovieVideo[];
  scrapedAt: string;
  Language: string;
  BoxOffice: string;
  title: string;
  url: string;
}

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
    const url = `http://localhost:8000/api/v1/omdb/getMovieByTitle?title=${encodedTitle}`;

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
        Search: [],
        totalResults: "0",
        Response: "False",
      },
    };
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
  data: { imdb_id, title, comment, rating, photoURL, displayName },
  token,
}: {
  data: commentType;
  token: string;
}): Promise<CommentResponseType | CommentErrorResponseType> => {
  try {
    const url = `http://localhost:8000/api/v1/user/reviews/`;
    const commentData = {
      imdb_id,
      title,
      comment,
      rating,
      photoURL,
      displayName,
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

export {
  getTrendingMovies,
  getMovieByTitle,
  getMovieData,
  submitCommentHandler,
  deleteCommentHandler,
  getMovieReviewsHandler,
};

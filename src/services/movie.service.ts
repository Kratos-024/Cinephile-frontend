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
export interface MovieTrendingResult {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  media_type: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieTrendingApiResponseData {
  page: number;
  results: MovieTrendingResult[];
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

const getMovieByTitle = async (
  title: string
): Promise<MovieTitleApiResponse> => {
  try {
    if (!title || title.trim() === "") {
      throw new Error("Title parameter is required");
    }

    const encodedTitle = encodeURIComponent(title.trim());
    const url = `http://localhost:8000/api/v1/tmdb/getMovieByTitle?title=${encodedTitle}`;

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
            adult: false,
            backdrop_path: "",
            id: 0,
            title: "",
            original_title: "",
            overview: "",
            poster_path: "",
            media_type: "",
            original_language: "",
            genre_ids: [0],
            popularity: 0,
            release_date: "",
            video: false,
            vote_average: 0,
            vote_count: 0,
          },
        ],
        total_pages: 0,
        total_results: 0,
      },
    };
  }
};
export { getTrendingMovies, getMovieByTitle };

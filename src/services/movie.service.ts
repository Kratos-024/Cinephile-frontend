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

interface MovieApiResponse {
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
export { getTrendingMovies, getMovieByTitle, getMovieData };

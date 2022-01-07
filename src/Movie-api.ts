import { API_KEYS, BASE_NAME } from "./api-key";

export interface IGetMovie {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovieResults[];
  total_pages: number;
  total_results: number;
}

export interface IMovieResults {
  overview: string;
  title: string;
  backdrop_path: string;
  poster_path: string;
  id: number;
}

export function getNowMovies() {
  return fetch(`${BASE_NAME}/movie/now_playing?api_key=${API_KEYS}`).then(
    (response) => response.json()
  );
}

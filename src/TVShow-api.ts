import { API_KEYS, BASE_NAME } from "./api-key";

export interface ITvResults {
  name: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  id: number;
}

export interface IGetTvShow {
  page: number;
  results: ITvResults[];
  total_pages: number;
  total_results: number;
}

export function getNowTvShow() {
  return fetch(`${BASE_NAME}/tv/on_the_air?api_key=${API_KEYS}`).then(
    (response) => response.json()
  );
}

export function getPopTvShow() {
  return fetch(`${BASE_NAME}/tv/popular?api_key=${API_KEYS}`).then((response) =>
    response.json()
  );
}

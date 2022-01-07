import { API_KEYS, BASE_NAME } from "./api-key";

export interface ISearch {
  page: number;
  results: ISearchResult[];
  total_pages: number;
  total_results: number;
}

export interface ISearchResult {
  id: number;
  vote_average: number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  title: string;
}

export async function getSearchItem(keyword: string) {
  const response = await (
    await fetch(
      `${BASE_NAME}/search/multi?api_key=${API_KEYS}&query=${keyword}&include_adult=false`
    )
  ).json();
  return response;
}

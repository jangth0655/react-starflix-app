export function makeImage(id: string, scale?: string) {
  return `https://image.tmdb.org/t/p/${scale ? scale : "original"}/${id}`;
}

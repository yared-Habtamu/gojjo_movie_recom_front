export function fullImageUrl(path?: string | null, size = "w500") {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  // TMDb relative path
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function fullBackdropUrl(path?: string | null) {
  if (!path) return "/placeholder-backdrop.jpg";
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/original${path}`;
}

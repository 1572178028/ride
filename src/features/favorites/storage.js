const key = "ride-atlas-favorites";
export function loadFavorites(routes, resolveRouteId, storage) {
  try {
    const value = JSON.parse(storage().getItem(key) || "[]");
    return new Set(
      Array.isArray(value)
        ? value
            .map(resolveRouteId)
            .filter((id) => routes.some((r) => r.id === id))
        : [],
    );
  } catch {
    return new Set();
  }
}
export function saveFavorites(saved, storage) {
  storage().setItem(key, JSON.stringify([...saved]));
}

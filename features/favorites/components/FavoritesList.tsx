import { getFavoritesServer } from "@/features/favorites/api/favorites.server"
import { FavoritesGrid } from "./FavoritesGrid"

const FAVORITES_PAGE_SIZE = 12

interface FavoritesListProps {
  page: number
}

export async function FavoritesList({ page }: FavoritesListProps) {
  const query = { page, pageSize: FAVORITES_PAGE_SIZE }
  const data = await getFavoritesServer(query)

  return <FavoritesGrid query={query} initialData={data} />
}

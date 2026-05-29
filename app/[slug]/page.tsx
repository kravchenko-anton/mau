import { notFound } from "next/navigation"
import { getCityBySlug } from "@/lib/cities"
import { getCategoryBySlug } from "@/lib/categories"
import { CityPage } from "@/components/pages/city-page"
import { CategoryPage } from "@/components/pages/category-page"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const city = getCityBySlug(slug)
  if (city) return <CityPage city={city} />

  const category = getCategoryBySlug(slug)
  if (category) return <CategoryPage category={category} />

  notFound()
}

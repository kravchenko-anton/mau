import Link from "next/link"
import Image from "next/image"
import { categories } from "@/lib/categories"
import { formatEventCount } from "@/lib/utils"

export function CategoryGrid() {
  return (
    <section className="reveal reveal-2 mt-24">
      <h2 className="mb-7 text-[32px] text-foreground">Przeglądaj według kategorii</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map(({ slug, label, eventCount, icon: Icon, color }) => (
          <Link
            key={slug}
            href={`/${slug}`}
            className="flex flex-col items-center gap-4 rounded-[24px] bg-card px-3.5 py-8 text-center transition-all hover:-translate-y-0.5"
          >
            <Icon className="size-10" strokeWidth={1.75} style={{ color }} />
            <div className="flex flex-col gap-1">
              <span className="text-base font-medium leading-tight text-foreground">{label}</span>
              <span className="font-mono text-[13px] text-muted-2">{formatEventCount(eventCount)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

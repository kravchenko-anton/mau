import Link from "next/link"
import Image from "next/image"
import {
  Laptop,
  Palette,
  Drama,
  Users,
  Briefcase,
  Code2
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Category = {
  label: string
  count: string
  icon: LucideIcon
  color: string
  href: string
  image?: string
}

const categories: Category[] = [
  { label: "Kultura", count: "13 wydarzeń", icon: Drama, color: "#ef4444", href: "/kultura" },
  { label: "Społeczność", count: "10 wydarzeń", icon: Users, color: "#f97316", href: "/spolecznosc" },
  { label: "Technologie", count: "3 wydarzenia", icon: Laptop, color: "#2563eb", href: "/tech" },
  { label: "Biznes", count: "1 wydarzenie", icon: Briefcase, color: "#16a34a", href: "/biznes" },
  { label: "Sztuka", count: "11 wydarzeń", icon: Palette, color: "#a855f7", href: "/sztuka" },
  { label: "Hackathony", count: "Wkrótce", icon: Code2, color: "#06b6d4", href: "/hackathony" },
]

export function CategoryGrid() {
  return (
    <section className="reveal reveal-2 mt-24">
      <h2 className="mb-7 text-[32px] text-foreground">Przeglądaj według kategorii</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map(({ label, count, icon: Icon, color, href, image }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-4 rounded-[24px] bg-card px-3.5 py-8 text-center transition-all hover:-translate-y-0.5"
          >
            {image ? (
              <Image
                src={image}
                alt={label}
                width={40}
                height={40}
                className="size-14 rounded-md object-cover"
              />
            ) : (
              <Icon className="size-10" strokeWidth={1.75} style={{ color }} />
            )}
            <div className="flex flex-col gap-1">
              <span className="text-base font-medium leading-tight text-foreground">{label}</span>
              <span className="font-mono text-[13px] text-muted-2">{count}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
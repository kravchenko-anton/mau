"use client"

import Link from "next/link"
import Image from "next/image"
import { cities } from "@/lib/cities"
import { cn, formatEventCount } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const activeCitySlugs = new Set(cities.map((city) => city.slug))

const cityCardClassName =
  "group relative block overflow-hidden rounded-2xl border border-black/10 aspect-[3/4] transition-transform"

const cityCardStyle = {
  backgroundColor: "#f0eee6",
  backgroundImage: "radial-gradient(circle, #c8c5bc 1px, transparent 1px)",
  backgroundSize: "22px 22px",
}

function CityCardContent({
  city,
  isActive,
}: {
  city: (typeof cities)[number]
  isActive: boolean
}) {
  return (
    <>
      <Image
        src={city.image}
        alt={city.name}
        fill
        className={cn(
          "object-cover mt-4 [object-position:center_120%] transition-all duration-500",
          isActive ? "group-hover:scale-105" : "grayscale opacity-55 group-hover:opacity-45"
        )}
      />
      <div className="absolute top-5 left-5 flex flex-col">
        <span className={cn("text-xl font-bold", isActive ? "text-black" : "text-black/40")}>{city.name}</span>
        <span className={cn("text-sm", isActive ? "text-black/75" : "text-black/35")}>
          {formatEventCount(city.eventCount ?? 0)}
        </span>
      </div>
    </>
  )
}

export function LocalEvents() {
  return (
    <section className="reveal reveal-4 mt-24 pb-2">
      <h2 className="mb-1.5 text-[32px] text-foreground">Odkrywaj lokalne wydarzenia</h2>
      <p className="mb-7 text-lg">Największe miasta w Polsce</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cities.map((city) => {
          const isActive = activeCitySlugs.has(city.slug)

          if (isActive) {
            return (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className={cn(cityCardClassName, "hover:scale-[1.02]")}
                style={cityCardStyle}
              >
                <CityCardContent city={city} isActive={isActive} />
              </Link>
            )
          }

          return (
            <Tooltip key={city.slug}>
              <TooltipTrigger asChild>
                <span
                  role="link"
                  aria-disabled="true"
                  tabIndex={0}
                  className={cn(
                    cityCardClassName,
                    "cursor-not-allowed select-none border-black/5 bg-muted outline-none grayscale hover:grayscale focus-visible:ring-2 focus-visible:ring-ring/30"
                  )}
                  style={cityCardStyle}
                >
                  <CityCardContent city={city} isActive={isActive} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Wkrótce będzie dostępne</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </section>
  )
}

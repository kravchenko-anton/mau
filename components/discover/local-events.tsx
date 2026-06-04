"use client"

import Link from "next/link"
import Image from "next/image"
import { cities } from "@/lib/cities"
import { cn, formatEventCount } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const activeCitySlugs = new Set(cities.map((city) => city.slug))

const cityCardClassName =
  "group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 transition-transform sm:aspect-[3/4]"

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
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className={cn(
          "object-contain object-bottom px-2 pt-6 transition-all duration-500 sm:px-0 sm:pt-4",
          isActive ? "group-hover:scale-105" : "grayscale opacity-55 group-hover:opacity-45"
        )}
      />
      <div className="absolute left-4 top-4 flex flex-col sm:left-5 sm:top-5">
        <span className={cn("text-base font-bold sm:text-xl", isActive ? "text-black" : "text-black/40")}>{city.name}</span>
        <span className={cn("text-xs sm:text-sm", isActive ? "text-black/75" : "text-black/35")}>
          {formatEventCount(city.eventCount ?? 0)}
        </span>
      </div>
    </>
  )
}

export function LocalEvents() {
  return (
    <section className="reveal reveal-4 mt-16 pb-2 sm:mt-20 lg:mt-24">
      <h2 className="mb-1.5 text-2xl text-foreground sm:text-[32px]">Odkrywaj lokalne wydarzenia</h2>
      <p className="mb-5 text-base text-muted-foreground sm:mb-7 sm:text-lg">Największe miasta w Polsce</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
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

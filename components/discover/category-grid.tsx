"use client"

import Link from "next/link"
import {activeCategorySlugs, categories} from "@/lib/categories"
import { cn, formatEventCount } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"


const orderedCategories = [
  ...categories.filter((category) => activeCategorySlugs.has(category.slug)),
  ...categories.filter((category) => !activeCategorySlugs.has(category.slug)),
]

const cardClassName =
  "flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl bg-card px-3 py-5 text-center transition-all sm:min-h-40 sm:gap-4 sm:rounded-[24px] sm:px-3.5 sm:py-8"

export function CategoryGrid() {
  return (
    <section className="reveal reveal-2 mt-14 sm:mt-20 lg:mt-24">
      <h2 className="mb-5 text-2xl text-foreground sm:mb-7 sm:text-[32px]">Przeglądaj według kategorii</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
        {orderedCategories.map(({ slug, label, eventCount, icon: Icon, color }) => {
          const isActive = activeCategorySlugs.has(slug)
          const content = (
            <>
              <Icon
                className="size-8 sm:size-10"
                strokeWidth={1.75}
                style={{ color: isActive ? color : "#9ca3af" }}
              />
              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    "text-sm font-medium leading-tight sm:text-base",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
                <span className="font-mono text-xs text-muted-2 sm:text-[13px]">{formatEventCount(eventCount)}</span>
              </div>
            </>
          )

          if (isActive) {
            return (
              <Link key={slug} href={`/${slug}`} className={cn(cardClassName, "hover:-translate-y-0.5")}>
                {content}
              </Link>
            )
          }

          return (
            <Tooltip key={slug}>
              <TooltipTrigger asChild>
                <span
                  role="link"
                  aria-disabled="true"
                  tabIndex={0}
                  className={cn(
                    cardClassName,
                    "cursor-not-allowed select-none outline-none hover:bg-muted hover:grayscale focus-visible:ring-2 focus-visible:ring-ring/30"
                  )}
                >
                  {content}
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

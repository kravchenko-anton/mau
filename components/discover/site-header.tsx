"use client"

import Link from "next/link"
import { Asterisk } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"


export function SiteHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:h-[88px] sm:px-6 lg:px-10">
        <div className="flex items-center gap-7">
          <Link href="/" aria-label="Strona główna" className="inline-flex size-11 items-center justify-center text-primary">
            <Asterisk className="size-8" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="hidden cursor-not-allowed sm:inline-flex">
                <Button
                  variant="ghost"
                  disabled
                  className="pointer-events-none text-base font-medium text-muted-foreground opacity-100"
                >
                  <span className="hidden sm:inline">Utwórz wydarzenie</span>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Wkrótce będzie dostępne</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="size-10 cursor-not-allowed sm:size-11">
                <AvatarFallback className="bg-black text-base font-semibold text-white">
                  M
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>Wkrótce dostępne</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}

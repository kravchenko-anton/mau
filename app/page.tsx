import { SiteHeader } from "@/components/discover/site-header"
import { SiteFooter } from "@/components/discover/site-footer"
import { CategoryGrid } from "@/components/discover/category-grid"
import { LocalEvents } from "@/components/discover/local-events"
import Image from "next/image"

export default function Page() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <section className="reveal pb-2 pt-16 sm:pt-24 lg:pt-[112px]">
         <div className="flex items-center gap-5">
           <h1 className="max-w-[1120px] text-[42px] leading-[1.04] text-foreground sm:text-[58px] md:text-[76px] lg:text-[88px]">
             Odkrywaj wydarzenia IT w Polsce<sup><Image src="/poland.png" alt="Polska" width={64} height={64} sizes="64px" className="inline-block h-[0.55em] w-auto" style={{verticalAlign: '0.08em'}} /></sup>
           </h1>
         </div>
          <p className="mt-5 max-w-[640px] text-base leading-[1.55] text-muted-foreground sm:mt-7 sm:text-lg md:text-xl">
            Przeglądaj popularne wydarzenia w pobliżu, wybieraj według kategorii lub zajrzyj do świetnych
            kalendarzy społeczności.
          </p>
        </section>

        <CategoryGrid />
        <LocalEvents />
        
      </main>

      <SiteFooter lang="pl" />
    </>
  )
}

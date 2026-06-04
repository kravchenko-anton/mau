import { SiteHeader } from "@/components/discover/site-header"
import { SiteFooter } from "@/components/discover/site-footer"
import { CategoryGrid } from "@/components/discover/category-grid"
import { LocalEvents } from "@/components/discover/local-events"
import Image from "next/image"

export default function Page() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-[1400px] px-10">
        <section className="reveal pb-2 pt-[112px]">
         <div className='flex gap-5 items-center'>
           <h1 className="text-5xl leading-[1.03] text-foreground md:text-[88px]">
             Odkrywaj wydarzenia IT w Polsce<sup><Image src="/poland.png" alt="Polska" width={64} height={64} className="inline-block h-[0.6em] w-auto" style={{verticalAlign: '0.1em'}} /></sup>
           </h1>
         </div>
          <p className="mt-8 max-w-[640px] text-xl leading-[1.5] text-muted-foreground">
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

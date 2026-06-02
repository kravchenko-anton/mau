import Link from "next/link"
import Image from "next/image"
import { cities } from "@/lib/cities"
import { formatEventCount } from "@/lib/utils"

export function LocalEvents() {
  return (
    <section className="reveal reveal-4 mt-24 pb-2">
      <h2 className="mb-1.5 text-[32px] text-foreground">Odkrywaj lokalne wydarzenia</h2>
      <p className="mb-7 text-lg ">Największe miasta w Polsce</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/${city.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-black/10 aspect-[3/4] transition-transform hover:scale-[1.02]"
            style={{
              backgroundColor: "#f0eee6",
              backgroundImage: "radial-gradient(circle, #c8c5bc 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          >
            <Image
              src={city.image}
              alt={city.name}
              fill
              className="object-cover mt-4 [object-position:center_120%] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-5 left-5 flex flex-col ">
              <span className="text-xl font-bold text-black">{city.name}</span>
              <span className=" text-sm text-black/75">{formatEventCount(city.eventCount ?? 0)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

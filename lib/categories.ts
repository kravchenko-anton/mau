import {
  Briefcase,
  Code2,
  BitcoinIcon,
  Network,
  BrainCircuit,
  Venus,
  Globe,
  Smartphone,
  Server,
  GitBranch,
  Shield,
  Cloud, Drama,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { events } from "@/lib/event-data"

export type Category = {
  slug: string
  key: string
  label: string
  description: string
  eventCount: number
  icon: LucideIcon
  color: string
}

const categoryDefs: Omit<Category, "eventCount">[] = [
  {
    slug: "kultura",
    key: "kultura",
    label: "Kultura",
    description: "Festiwale literackie, muzyczne, filmowe i teatralne. Przeglądaj najciekawsze wydarzenia kulturalne w polskich miastach — od kameralnych wernisaży po wielkie plenerowe festiwale.",
    icon: Drama,
    color: "#ef4444",
  },
  {
    slug: "biznes",
    key: "biznes",
    label: "Biznes/Startups",
    description: "Targi, konferencje i eventy networkingowe. Networking, pitche startupów i branżowe konferencje dla przedsiębiorców i managerów.",
    icon: Briefcase,
    color: "#16a34a",
  },
  {
    slug: "hackathony",
    key: "hackathony",
    label: "Hackathony",
    description: "Intensywne maratony kodowania, tworzenia i innowacji. Rywalizuj z najlepszymi, poznaj nowych partnerów i stwórz coś wartościowego w 24–48 godzin.",
    icon: Code2,
    color: "#06b6d4",
  },
  {
    slug: "networking",
    key: "networking",
    label: "Networking",
    description: "Meetupy, spotkania branżowe i wydarzenia nastawione na poznawanie ludzi. Buduj relacje, wymieniaj kontakty i odkrywaj nowe możliwości współpracy.",
    icon: Network,
    color: "#2563eb",
  },
  {
    slug: "ai",
    key: "ai",
    label: "AI",
    description: "Konferencje, warsztaty i meetupy o sztucznej inteligencji. Poznaj praktyczne zastosowania AI, narzędzia, trendy i ludzi tworzących przyszłość technologii.",
    icon: BrainCircuit,
    color: "#9333ea",
  },
  {
    slug: "woman4woman",
    key: "woman4woman",
    label: "Woman4Woman",
    description: "Wydarzenia tworzone z myślą o kobietach i społecznościach wspierających kobiety. Spotkania, mentoring, rozwój i wymiana doświadczeń.",
    icon: Venus,
    color: "#db2777",
  },
  {
    slug: "web",
    key: "web",
    label: "Web",
    description: "Konferencje, meetupy i warsztaty o technologiach webowych. Frontend, frameworki, architektura aplikacji i praktyki tworzenia nowoczesnych produktów internetowych.",
    icon: Globe,
    color: "#0ea5e9",
  },
  {
    slug: "mobile",
    key: "mobile",
    label: "Mobile",
    description: "Wydarzenia o aplikacjach mobilnych, UX na urządzeniach przenośnych i rozwoju produktów na iOS oraz Androida.",
    icon: Smartphone,
    color: "#14b8a6",
  },
  {
    slug: "backend",
    key: "backend",
    label: "Backend",
    description: "Meetupy i konferencje o systemach serwerowych, API, bazach danych, skalowaniu usług i dobrych praktykach inżynierii backendowej.",
    icon: Server,
    color: "#64748b",
  },
  {
    slug: "devops",
    key: "devops",
    label: "DevOps",
    description: "Wydarzenia o automatyzacji, CI/CD, infrastrukturze, obserwowalności i kulturze współpracy między developmentem a operacjami.",
    icon: GitBranch,
    color: "#84cc16",
  },
  {
    slug: "cybersecurity",
    key: "cybersecurity",
    label: "Cybersecurity",
    description: "Konferencje, szkolenia i meetupy o bezpieczeństwie aplikacji, infrastruktury, danych oraz praktykach ochrony organizacji.",
    icon: Shield,
    color: "#dc2626",
  },
  {
    slug: "cloud",
    key: "cloud",
    label: "Cloud",
    description: "Wydarzenia o chmurze publicznej, architekturze cloud-native, konteneryzacji, platformach i skalowaniu systemów.",
    icon: Cloud,
    color: "#0284c7",
  },
]

function countByCategory(key: string): number {
  const today = new Date().toISOString().slice(0, 10)
  return events.filter((e) => e.category.includes(key) && e.date_end >= today).length
}

export const categories: Category[] = categoryDefs.map((c) => ({
  ...c,
  eventCount: countByCategory(c.key),
}))

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}


export const activeCategorySlugs = new Set([
  "biznes",
  "hackathony",
  "networking",
  "ai",
  "woman4woman",
  "web",
  "mobile",
  "backend",
  "devops",
  "cybersecurity",
  "cloud"
])

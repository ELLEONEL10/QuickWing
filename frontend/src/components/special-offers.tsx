import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const offers = [
  {
    id: 1,
    title: "Summer Sale: 20% Off European Flights",
    description: "Book by June 30 for travel between July and September",
    image: "/placeholder.svg?height=300&width=600",
    discount: "20%",
  },
  {
    id: 2,
    title: "Business Class Upgrade",
    description: "Upgrade to Business Class for just $299 on long-haul flights",
    image: "/placeholder.svg?height=300&width=600",
    discount: "$299",
  },
  {
    id: 3,
    title: "Weekend Getaway Special",
    description: "Fly Friday to Monday and save up to 15% on selected routes",
    image: "/placeholder.svg?height=300&width=600",
    discount: "15%",
  },
]

export function SpecialOffers() {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Special Offers</h2>
          <p className="max-w-md mt-4 text-muted-foreground">Take advantage of our limited-time deals and promotions</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {offers.map((offer) => (
            <Link href={`/offers/${offer.id}`} key={offer.id}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-40">
                  <Badge className="absolute z-10 top-3 right-3 bg-rose-500 hover:bg-rose-600">
                    Save {offer.discount}
                  </Badge>
                  <Image src={offer.image || "/placeholder.svg"} alt={offer.title} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{offer.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{offer.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

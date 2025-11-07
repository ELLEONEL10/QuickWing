import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const destinations = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    image: "/placeholder.svg?height=400&width=600",
    price: 299,
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japan",
    image: "/placeholder.svg?height=400&width=600",
    price: 799,
  },
  {
    id: 3,
    name: "New York",
    country: "USA",
    image: "/placeholder.svg?height=400&width=600",
    price: 349,
  },
  {
    id: 4,
    name: "Bali",
    country: "Indonesia",
    image: "/placeholder.svg?height=400&width=600",
    price: 599,
  },
]

export function FeaturedDestinations() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Popular Destinations</h2>
          <p className="max-w-md mt-4 text-muted-foreground">
            Explore our most popular flight destinations with great deals
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <Link href={`/destinations/${destination.id}`} key={destination.id}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-48">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{destination.name}</h3>
                      <p className="text-sm text-muted-foreground">{destination.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-semibold text-rose-500">${destination.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/destinations">
            <Button variant="outline">View All Destinations</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

import { Button } from "@/components/ui/button"

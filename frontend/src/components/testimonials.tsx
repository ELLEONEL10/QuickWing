import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "SkyWay made booking my international flight so easy! The interface is intuitive and I found a great deal in minutes.",
  },
  {
    id: 2,
    name: "David Chen",
    location: "Toronto, Canada",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "I've been using SkyWay for all my business trips. Their customer service is exceptional and the booking process is seamless.",
  },
  {
    id: 3,
    name: "Maria Garcia",
    location: "Barcelona, Spain",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    text: "Great selection of flights and competitive prices. I saved over €200 on my last booking compared to other sites!",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Customers Say</h2>
          <p className="max-w-md mt-4 text-muted-foreground">
            Thousands of travelers trust SkyWay for their flight bookings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

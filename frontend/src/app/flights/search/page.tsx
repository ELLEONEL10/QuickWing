import { ArrowRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const flights = [
  {
    id: "fl-1",
    airline: "SkyWay Airlines",
    airlineLogo: "/placeholder.svg?height=40&width=40",
    departureTime: "08:30",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "11:45",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "6h 15m",
    stops: 0,
    price: 299,
  },
  {
    id: "fl-2",
    airline: "Global Airways",
    airlineLogo: "/placeholder.svg?height=40&width=40",
    departureTime: "10:15",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "14:30",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "7h 15m",
    stops: 1,
    stopAirport: "DFW",
    price: 249,
  },
  {
    id: "fl-3",
    airline: "Pacific Air",
    airlineLogo: "/placeholder.svg?height=40&width=40",
    departureTime: "14:20",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "17:35",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "6h 15m",
    stops: 0,
    price: 329,
  },
  {
    id: "fl-4",
    airline: "American Eagle",
    airlineLogo: "/placeholder.svg?height=40&width=40",
    departureTime: "16:45",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "22:15",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "8h 30m",
    stops: 1,
    stopAirport: "ORD",
    price: 219,
  },
]

export default function SearchPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Flight Search Results</h1>
        <p className="text-sm text-muted-foreground">
          New York (JFK) to Los Angeles (LAX) · Apr 28, 2025 · 1 Passenger
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <div className="order-2 md:order-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="flex items-center mb-4 text-lg font-semibold">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Price Range</h3>
                  <div className="space-y-4">
                    <Slider defaultValue={[200, 400]} min={100} max={1000} step={10} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">$200</span>
                      <span className="text-sm">$400</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 text-sm font-medium">Stops</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="nonstop" className="text-sm">
                        Nonstop
                      </label>
                      <Switch id="nonstop" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="one-stop" className="text-sm">
                        1 Stop
                      </label>
                      <Switch id="one-stop" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="two-plus-stops" className="text-sm">
                        2+ Stops
                      </label>
                      <Switch id="two-plus-stops" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 text-sm font-medium">Airlines</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="skyway" className="text-sm">
                        SkyWay Airlines
                      </label>
                      <Switch id="skyway" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="global" className="text-sm">
                        Global Airways
                      </label>
                      <Switch id="global" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="pacific" className="text-sm">
                        Pacific Air
                      </label>
                      <Switch id="pacific" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="american" className="text-sm">
                        American Eagle
                      </label>
                      <Switch id="american" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 text-sm font-medium">Departure Time</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="morning" className="text-sm">
                        Morning (5am - 12pm)
                      </label>
                      <Switch id="morning" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="afternoon" className="text-sm">
                        Afternoon (12pm - 5pm)
                      </label>
                      <Switch id="afternoon" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="evening" className="text-sm">
                        Evening (5pm - 11pm)
                      </label>
                      <Switch id="evening" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="order-1 md:order-2">
          <div className="space-y-4">
            {flights.map((flight) => (
              <Card key={flight.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            src={flight.airlineLogo || "/placeholder.svg"}
                            alt={flight.airline}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{flight.airline}</h3>
                          <p className="text-xs text-muted-foreground">Flight #{flight.id}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
                        <div>
                          <p className="text-2xl font-semibold">{flight.departureTime}</p>
                          <p className="font-medium">{flight.departureAirport}</p>
                          <p className="text-sm text-muted-foreground">{flight.departureCity}</p>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                          <p className="text-xs text-muted-foreground">{flight.duration}</p>
                          <div className="relative w-full my-2">
                            <Separator className="absolute top-1/2 w-full" />
                            <div className="relative flex items-center justify-center">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                              {flight.stops > 0 && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                                  <Badge variant="outline" className="text-xs">
                                    {flight.stops} stop
                                  </Badge>
                                </div>
                              )}
                              <ArrowRight className="absolute w-4 h-4 right-0" />
                            </div>
                          </div>
                          {flight.stops > 0 && (
                            <p className="text-xs text-muted-foreground">via {flight.stopAirport}</p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-semibold">{flight.arrivalTime}</p>
                          <p className="font-medium">{flight.arrivalAirport}</p>
                          <p className="text-sm text-muted-foreground">{flight.arrivalCity}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 sm:p-6">
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="text-2xl font-bold text-rose-500">${flight.price}</p>
                      <p className="mb-4 text-xs text-muted-foreground">per person</p>
                      <Link href={`/flights/booking/${flight.id}`}>
                        <Button className="bg-rose-500 hover:bg-rose-600">Select</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
